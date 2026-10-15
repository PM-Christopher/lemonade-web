import { test, expect } from "@playwright/test";

// A logged-out visit to a protected admin page goes to login.
test.use({ storageState: { cookies: [], origins: [] } });

test("a logged-out deep link redirects to login", async ({ page }) => {
  await page.goto("/wallet-management");

  await expect(page).toHaveURL(/\/login\?next=%2Fwallet-management$/);
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});
