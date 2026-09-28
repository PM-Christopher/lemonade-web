import { test, expect } from "@playwright/test";

// Journey 4 (partial) from docs/ARCHITECTURE.md §17 — "buy a ticket →
// payment redirect → confirmation → ticket appears". Covers real backend
// integration through the actual redirect: a real order gets created, a
// real Paystack test-mode transaction gets initialized (PAYSTACK_SECRET_KEY
// in lemonade-backend's .env), and the app really navigates the browser to
// a live checkout.paystack.com session.
//
// Deliberately stops there. Paystack's hosted checkout is behind
// Cloudflare's bot-challenge page ("Just a moment...") — confirmed live by
// opening a real checkout URL with Playwright and inspecting the response;
// it's not a flakiness problem to retry past, it's active anti-automation
// protection on a third party's payment page. Driving the checkout form
// itself would mean building tooling specifically to defeat that
// protection, which this suite won't do regardless of how much effort goes
// into it. "confirmation → ticket appears" therefore isn't automated here;
// it needs a human to complete a real test-card payment at least once, or
// a legitimate server-to-server route (a webhook simulator, if Paystack
// ever offers one for test mode) neither of which exist in this pass.
//
// Leaves a real, harmless "pending" Order/Attendee/AssignedTicket row
// behind each run, same as any real user who starts checkout and abandons
// it before paying — those never reach "paid"/non-pending status, so they
// never surface in "my tickets" or anywhere else in the UI.
test("buying a paid ticket creates a real order and redirects to a live Paystack checkout", async ({
  page,
}) => {
  const eventId = process.env.E2E_PAID_EVENT_ID;
  if (!eventId) {
    throw new Error(
      "E2E_PAID_EVENT_ID must be set to a real event id with an active, paid ticket type — see README.md",
    );
  }

  await page.goto(`/event/${eventId}/buy-ticket`);

  await page.locator("p", { hasText: "+" }).first().click();
  await page.getByRole("button", { name: "Assign ticket" }).last().click();

  await expect(page).toHaveURL(new RegExp(`/event/${eventId}/assign-ticket`), { timeout: 15_000 });

  await page.locator("#fullname").fill("E2E Ticket Test");
  await page.locator("#email").fill(`e2e-ticket-${Date.now()}@example.com`);
  await page.getByRole("button", { name: "Pay now" }).click();

  await page.waitForURL(/checkout\.paystack\.com/, { timeout: 20_000 });
  expect(page.url()).toContain("checkout.paystack.com");
});
