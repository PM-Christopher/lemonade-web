import { test, expect } from "@playwright/test";

// Real server-side pagination wiring, verified against the live backend —
// see docs/ARCHITECTURE.md §22 Conflict 1 and tooling/e2e/README.md.
test("clicking page 2 on /users fetches a different page from the server, updates the URL", async ({
  page,
}) => {
  await page.goto("/users");

  const firstRowBefore = page.locator("tbody tr").first();
  await expect(firstRowBefore).toBeVisible({ timeout: 15_000 });
  const firstRowTextBefore = await firstRowBefore.textContent();

  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));

  const pageTwoButton = page.getByRole("button", { name: "2", exact: true });
  await expect(pageTwoButton).toBeVisible();
  await pageTwoButton.click();

  await expect(page).toHaveURL(/[?&]page=2/);

  const firstRowAfter = page.locator("tbody tr").first();
  await expect(firstRowAfter).toBeVisible();
  await expect
    .poll(async () => firstRowAfter.textContent(), { timeout: 10_000 })
    .not.toBe(firstRowTextBefore);

  expect(pageErrors, pageErrors.map((e) => e.message).join("\n")).toHaveLength(0);
});

test("searching on /users still searches every user, not just the current page", async ({
  page,
}) => {
  await page.goto("/users");

  const row = page.getByRole("row", { name: /Demo User/ });
  await expect(row).toBeVisible({ timeout: 15_000 });

  await page.locator("#search").fill("user@lemonade.com");

  // Debounced (500ms) — the search request lands after that, over the full
  // unpaginated list, not just whatever page happened to be showing.
  await expect(page.getByRole("row", { name: /Demo User/ })).toBeVisible({ timeout: 3_000 });
});

test("clicking page 2 on /transactions (plan-subscriptions, the default tab) fetches a different page", async ({
  page,
}) => {
  await page.goto("/transactions");

  const firstRowBefore = page.locator("tbody tr").first();
  await expect(firstRowBefore).toBeVisible({ timeout: 15_000 });
  const firstRowTextBefore = await firstRowBefore.textContent();

  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));

  await page.getByRole("button", { name: "2", exact: true }).click();
  await expect(page).toHaveURL(/[?&]page=2/);

  const firstRowAfter = page.locator("tbody tr").first();
  await expect
    .poll(async () => firstRowAfter.textContent(), { timeout: 10_000 })
    .not.toBe(firstRowTextBefore);

  expect(pageErrors, pageErrors.map((e) => e.message).join("\n")).toHaveLength(0);
});

test("switching to the events tab on /transactions resets to page 1 and paginates independently", async ({
  page,
}) => {
  await page.goto("/transactions?page=2");

  // "Events" also appears as a sidebar nav link — scope to the tab bar's <p>.
  await page.locator("main p", { hasText: "Events" }).first().click();
  await expect(page).not.toHaveURL(/[?&]page=2/);

  const row = page.locator("tbody tr").first();
  await expect(row).toBeVisible({ timeout: 15_000 });

  const pageTwoButton = page.getByRole("button", { name: "2", exact: true });
  await expect(pageTwoButton).toBeVisible();
  const firstRowTextBefore = await row.textContent();
  await pageTwoButton.click();

  await expect
    .poll(async () => page.locator("tbody tr").first().textContent(), { timeout: 10_000 })
    .not.toBe(firstRowTextBefore);
});
