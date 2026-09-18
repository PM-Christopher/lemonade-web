import { test as setup, expect } from "@playwright/test";

const authFile = ".auth/admin.json";

setup("authenticate as a real admin", async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD must be set — see tooling/e2e/README.md",
    );
  }

  await page.goto("/login");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("#password")).toHaveCount(0, { timeout: 15_000 });

  await page.context().storageState({ path: authFile });
});
