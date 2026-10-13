import { test, expect } from "@playwright/test";
import { markPaid, referenceForCheckout, sendChargeSuccessWebhook } from "../support/paystack";

// Journey 4 (docs/ARCHITECTURE.md §17): buy a ticket, payment redirect, confirmation,
// ticket appears. The purchase starts a real order and a real Paystack test-mode
// transaction, and the app sends the browser to a live checkout.paystack.com session.
// That page is behind Cloudflare's bot challenge, so a test can't pay on it. The payment
// is completed through the proxy in support/paystack-proxy.mjs and finished the way
// Paystack finishes it, with a signed charge.success webhook to the backend.
interface MyTicketsResponse {
  data: unknown;
}

test("buying a paid ticket redirects to checkout and the ticket appears once paid", async ({
  page,
}) => {
  const eventId = process.env.E2E_PAID_EVENT_ID;
  if (!eventId) {
    throw new Error(
      "E2E_PAID_EVENT_ID must be set to a real event id with an active, paid ticket type — see README.md",
    );
  }

  test.setTimeout(120_000);

  const ticketsBefore = await page.request.get("/api/v1/user/events/attendees/my-tickets");
  expect(ticketsBefore.ok()).toBeTruthy();
  const countBefore = (await ticketsBefore.text()).split(eventId).length - 1;

  await page.goto(`/event/${eventId}/buy-ticket`, { waitUntil: "domcontentloaded" });

  await page.getByText("+", { exact: true }).first().click();
  await page.getByRole("button", { name: "Assign ticket" }).last().click();

  await expect(page).toHaveURL(new RegExp(`/event/${eventId}/assign-ticket`), { timeout: 20_000 });

  // The ticket goes to the demo user's own email, so it shows up in their tickets.
  await page.locator("#fullname").fill("Demo User");
  await page.locator("#email").fill(process.env.E2E_USER_EMAIL ?? "");

  // The page navigates away as soon as this answers, so read the body in the route.
  let checkoutUrl = "";
  await page.route("**/user/events/attendees/*/assign-tickets", async (route) => {
    const response = await route.fetch();
    const body = (await response.json()) as { data?: { payment_url?: string } };
    checkoutUrl = body.data?.payment_url ?? "";
    await route.fulfill({ response });
  });
  await page.getByRole("button", { name: "Pay now" }).click();

  // Paystack's checkout sits behind a challenge page that often never fires
  // "load". Arriving at the host is the assertion this test owns.
  await page.waitForURL(/checkout\.paystack\.com/, { timeout: 45_000, waitUntil: "commit" });
  const reference = await referenceForCheckout(page.request, checkoutUrl);

  // Nothing is issued until the payment clears.
  const unpaid = await page.request.get("/api/v1/user/events/attendees/my-tickets");
  expect((await unpaid.text()).split(eventId).length - 1).toBe(countBefore);

  // The payment clears and Paystack tells the backend.
  await markPaid(page.request, reference);
  await sendChargeSuccessWebhook(page.request, reference);

  await expect
    .poll(
      async () => {
        const tickets = await page.request.get("/api/v1/user/events/attendees/my-tickets");
        return (
          ((await tickets.json()) as MyTicketsResponse) &&
          (await tickets.text()).split(eventId).length - 1
        );
      },
      { timeout: 30_000 },
    )
    .toBeGreaterThan(countBefore);
});
