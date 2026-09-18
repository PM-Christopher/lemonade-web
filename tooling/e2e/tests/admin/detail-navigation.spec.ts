import { test, expect } from "@playwright/test";

// Real list → detail navigation, same rationale as users-detail.spec.ts.
// Deliberately excludes /tribes — confirmed elsewhere in this repo (see
// docs/ARCHITECTURE.md Phase 6) to be static mock content with no real
// data-driven navigation, so there's nothing real to click into. Every
// list here uses a clickable <tr>, not a <Link>, unlike frontend's
// card-based lists — see tests/frontend/detail-navigation.spec.ts.
//
// Also excludes /reporting, /announcements and /wallet-management — not
// broken, genuinely empty in this seed data ("0 Reports"/"0
// Announcements"/"0 Wallets", verified by screenshot, not assumed). A test
// asserting on a click target that doesn't exist isn't testing anything;
// add these back once the seed data has real rows for them.
const ROUTES = ["/events", "/team", "/transactions"];

for (const list of ROUTES) {
  test(`clicking a real row on ${list} navigates to a detail page`, async ({ page }) => {
    await page.goto(list);

    const row = page.locator("tbody tr").first();
    await expect(row).toBeVisible({ timeout: 15_000 });
    await row.click();

    await expect(page).toHaveURL(new RegExp(`${list}/[^/]+`));

    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));
    await expect(page.getByText("Unhandled Runtime Error")).toHaveCount(0);
    expect(pageErrors, pageErrors.map((e) => e.message).join("\n")).toHaveLength(0);
  });
}
