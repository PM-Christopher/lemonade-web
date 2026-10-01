import { test, expect } from "@playwright/test";

// Real dynamic-data navigation, not just a static route — exercises the
// list → detail flow admin actually uses day to day (moderation,
// support). See docs/ARCHITECTURE.md §17.
test("clicking a real user row navigates to their detail page", async ({ page }) => {
  await page.goto("/users", { waitUntil: "domcontentloaded" });

  // Click a row by its known content (the e2e admin's own account, always
  // present) rather than "first tbody tr" — the table's initial render can
  // get replaced once real data resolves, and a position-based locator can
  // click a row that's about to be swapped out from under it.
  const row = page.getByRole("row", { name: /Demo User/ });
  await expect(row).toBeVisible({ timeout: 15_000 }); // 708 real users to fetch and render
  await row.click();

  await expect(page).toHaveURL(/\/users\/[^/]+$/, { timeout: 20_000 });

  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));
  await expect(page.getByText("Unhandled Runtime Error")).toHaveCount(0);
  expect(pageErrors, pageErrors.map((e) => e.message).join("\n")).toHaveLength(0);
});
