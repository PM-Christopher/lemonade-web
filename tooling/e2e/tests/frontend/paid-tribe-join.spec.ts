import { test, expect, type APIRequestContext } from "@playwright/test";
import { markPaid } from "../support/paystack";

// Journey 5 (docs/ARCHITECTURE.md §17): join a paid tribe, the creator's wallet is
// credited. The join goes to a live Paystack checkout, which can't be driven from a
// test (Cloudflare bot challenge). A payment is completed through the proxy in
// support/paystack-proxy.mjs, then the browser comes back the way Paystack sends it,
// to the tribe page with ?trxref=, and the app verifies it for real.
const ADMIN_URL = "http://localhost:3001";

interface Tribe {
  id: string;
  slug: string;
  monetized: number | boolean;
  private: boolean;
  has_joined: boolean;
  owner: boolean;
}
interface LedgerEntry {
  entry_type: "credit" | "debit";
  amount: string;
  description: string;
}

// Wallet ledger, newest entry first, plus the entry count.
async function walletLedger(admin: APIRequestContext) {
  const response = await admin.get(
    "/api/v1/admin/transaction/ledger?account_type=user_wallet&per_page=5",
  );
  expect(response.ok()).toBeTruthy();
  const { data } = (await response.json()) as {
    data: { entries: LedgerEntry[]; meta: { total: number } };
  };
  return { total: data.meta.total, entries: data.entries };
}

test("joining a paid tribe credits its creator once the payment is verified", async ({
  page,
  browser,
}) => {
  test.setTimeout(150_000);

  const adminContext = await browser.newContext({
    baseURL: ADMIN_URL,
    storageState: ".auth/admin.json",
  });
  let joined: Tribe | undefined;

  try {
    const listed = await page.request.get("/api/v1/user/tribes?type=discover");
    expect(listed.ok()).toBeTruthy();
    const { data } = (await listed.json()) as { data: { tribes: Tribe[] } };
    const tribe = data.tribes.find((t) => t.monetized && !t.private && !t.has_joined && !t.owner);
    expect(tribe, "no paid public tribe to join in the seed data").toBeTruthy();
    if (!tribe) return;

    const before = await walletLedger(adminContext.request);

    // A non-member sees the summary, then pays to unlock it. The app sends them to checkout.
    await page.goto(`/tribe/${tribe.slug}`);
    await page.getByText("Unlock Tribe content").click();
    // The page navigates away as soon as this answers, so read the body in the route.
    let reference = "";
    await page.route("**/user/tribes/join-tribe/**", async (route) => {
      const response = await route.fetch();
      const body = (await response.json()) as { data?: { reference?: string } };
      reference = body.data?.reference ?? "";
      await route.fulfill({ response });
    });
    await page.getByRole("button", { name: "Join Tribe now" }).click();
    await page.waitForURL(/checkout\.paystack\.com/, { timeout: 45_000, waitUntil: "commit" });
    expect(reference).toMatch(/^LMN_/);

    // Not a member until the payment is verified, and the creator hasn't been paid.
    const threadsBefore = await page.request.get(`/api/v1/user/tribes/${tribe.slug}/threads/all`);
    expect(threadsBefore.status()).toBe(403);
    expect((await walletLedger(adminContext.request)).total).toBe(before.total);

    // The payment goes through, and Paystack sends the browser back to the tribe.
    await markPaid(page.request, reference);
    await page.goto(`/tribe/${tribe.slug}?trxref=${reference}&reference=${reference}`);
    await expect(page.getByText("Joined tribe successfully").first()).toBeVisible({
      timeout: 45_000,
    });
    joined = tribe;

    const threadsAfter = await page.request.get(`/api/v1/user/tribes/${tribe.slug}/threads/all`);
    expect(threadsAfter.ok()).toBeTruthy();

    // The creator's wallet got the member's fee, less the platform's cut.
    await expect
      .poll(async () => (await walletLedger(adminContext.request)).total)
      .toBe(before.total + 1);
    const credit = (await walletLedger(adminContext.request)).entries[0];
    expect(credit).toMatchObject({
      entry_type: "credit",
      description: "Credit tribe owner wallet",
    });
    expect(Number(credit?.amount)).toBeGreaterThan(0);
  } finally {
    // Leave the demo user as they were. The ledger keeps its history.
    if (joined) await page.request.post(`/api/v1/user/tribes/exit-tribe/${joined.id}`);
    await adminContext.close();
  }
});
