import { test, expect } from "@playwright/test";

// A logged-out visit to a protected page goes to login, then back to that page.
test.use({ storageState: { cookies: [], origins: [] } });

test("a logged-out deep link redirects to login and returns after sign-in", async ({ page }) => {
  test.setTimeout(90_000);

  await page.goto("/settings/wallet");
  await expect(page).toHaveURL(/\/login\?next=%2Fsettings%2Fwallet$/);

  await page.locator("#email").fill(process.env.E2E_USER_EMAIL ?? "");
  await page.locator("#password").fill(process.env.E2E_USER_PASSWORD ?? "");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/settings\/wallet$/, { timeout: 60_000 });
});
