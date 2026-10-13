import { test, expect, type APIRequestContext } from "@playwright/test";
import { markPaid } from "../support/paystack";

// Journey 9 (docs/ARCHITECTURE.md §17): subscribe to a plan, the plan's
// benefits show up, downgrade, the benefits go back. The paid plan is bought
// through the plan page and sent to Paystack's checkout, which can't be driven
// from a test (see journey 4). The payment is completed through the proxy in
// support/paystack-proxy.mjs and the browser comes back with ?trxref=, so the
// app verifies it for real.
const ADMIN_URL = "http://localhost:3001";

interface Plan {
  id: string;
  title: string;
  monthly_charge_minor: number;
  active: boolean;
  benefits: { event_creation: number };
}
interface SubscriptionResponse {
  data: { subscription: { title: string; benefits: { event_creation: number } } };
}

async function currentSubscription(request: APIRequestContext) {
  const response = await request.get("/api/v1/user/profile/subscription");
  expect(response.ok()).toBeTruthy();
  return ((await response.json()) as SubscriptionResponse).data.subscription;
}

test("a plan's benefits appear when subscribed and go back on downgrade", async ({
  page,
  browser,
}) => {
  test.setTimeout(150_000);

  const adminContext = await browser.newContext({
    baseURL: ADMIN_URL,
    storageState: ".auth/admin.json",
  });
  const admin = adminContext.request;

  try {
    const plansResponse = await admin.get("/api/v1/admin/subscriptions");
    expect(plansResponse.ok()).toBeTruthy();
    const { data } = (await plansResponse.json()) as { data: { plans?: Plan[] } };
    const plans = (data.plans ?? []).filter((plan) => plan.active);
    const paid = plans.find((plan) => plan.monthly_charge_minor > 0);
    const free = plans.find((plan) => plan.monthly_charge_minor === 0);
    expect(paid && free, "needs one active paid plan and one active free plan").toBeTruthy();
    if (!paid || !free) return;
    expect(paid.benefits.event_creation, "plans must differ in a reported benefit").not.toBe(
      free.benefits.event_creation,
    );

    const email = process.env.E2E_USER_EMAIL;
    const found = await admin.get(`/api/v1/admin/users?search=${encodeURIComponent(email ?? "")}`);
    const { data: users } = (await found.json()) as {
      data: { users: { id: string; email: string }[] };
    };
    const userId = users.users.find((user) => user.email === email)?.id;
    expect(userId, "demo user not found").toBeTruthy();

    // Start on the free plan. An admin resets it, since a run leaves the user on it anyway.
    const reset = await admin.patch(`/api/v1/admin/users/${userId}/change-plan`, {
      data: { subscription_id: free.id, type: "free" },
    });
    expect(reset.ok(), await reset.text()).toBeTruthy();
    expect((await currentSubscription(page.request)).benefits.event_creation).toBe(
      free.benefits.event_creation,
    );

    // The user picks the paid plan on the plan page and is sent to checkout.
    await page.goto("/settings/plan");
    await expect(page.getByText("Current plan")).toBeVisible({ timeout: 30_000 });
    const paidCard = page
      .locator("div.items-center")
      .filter({ has: page.getByText(paid.title, { exact: true }) })
      .filter({ hasText: "Subscribe" })
      .last();
    await paidCard.getByText("Subscribe", { exact: true }).click();

    const dialog = page.getByRole("dialog");
    await dialog.locator("button[aria-pressed]").first().click();
    // The page navigates away as soon as this answers, so read the body in the route.
    let reference = "";
    await page.route("**/subscription/change-plan", async (route) => {
      const response = await route.fetch();
      const body = (await response.json()) as { data?: { reference?: string } };
      reference = body.data?.reference ?? "";
      await route.fulfill({ response });
    });
    await dialog.getByRole("button", { name: "Pay now" }).click();
    await page.waitForURL(/checkout\.paystack\.com/, { timeout: 45_000, waitUntil: "commit" });
    expect(reference).toMatch(/^LMN_/);

    // Still on the free plan until the payment clears.
    expect((await currentSubscription(page.request)).title).toBe(free.title);

    // The payment goes through and Paystack sends the browser back to the plan page.
    await markPaid(page.request, reference);
    await page.goto(`/settings/plan?trxref=${reference}&reference=${reference}`);
    await expect
      .poll(async () => (await currentSubscription(page.request)).title, { timeout: 45_000 })
      .toBe(paid.title);
    const subscribed = await currentSubscription(page.request);
    expect(subscribed.benefits.event_creation).toBe(paid.benefits.event_creation);

    // The user downgrades from the plan page, which loads the current plan itself.
    await page.goto("/settings/plan");
    // The page marks the current plan once it has loaded it.
    await expect(page.getByText("Current plan")).toBeVisible({ timeout: 30_000 });
    const freeCard = page
      .locator("div.items-center")
      .filter({ has: page.getByText(free.title, { exact: true }) })
      .filter({ hasText: "Subscribe" })
      .last();
    await freeCard.getByText("Subscribe", { exact: true }).click();
    await expect(page).toHaveURL(/cancel-subscription/, { timeout: 30_000 });

    await page.getByText("I don't need the benefits anymore").click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();

    const changed = page.waitForResponse(
      (response) =>
        response.url().includes("/subscription/change-plan") &&
        response.request().method() === "POST",
    );
    await page.getByRole("button", { name: "Continue to downgrade" }).click();
    const changeResponse = await changed;
    expect(changeResponse.ok(), await changeResponse.text()).toBeTruthy();

    // The benefits are back to the free plan's.
    const downgraded = await currentSubscription(page.request);
    expect(downgraded.title).toBe(free.title);
    expect(downgraded.benefits.event_creation).toBe(free.benefits.event_creation);
  } finally {
    await adminContext.close();
  }
});
