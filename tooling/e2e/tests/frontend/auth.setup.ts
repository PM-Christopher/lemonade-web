import { test as setup, expect } from "@playwright/test";

const authFile = ".auth/user.json";

setup("authenticate as a real user", async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;
  if (!email || !password) {
    throw new Error("E2E_USER_EMAIL and E2E_USER_PASSWORD must be set — see tooling/e2e/README.md");
  }

  await page.goto("/login");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  // The login page itself does the redirect (router.push(next || "/")) —
  // waiting for the login form to disappear is a more robust signal than a
  // specific URL, since "next" can point anywhere.
  await expect(page.locator("#password")).toHaveCount(0, { timeout: 15_000 });

  await page.context().storageState({ path: authFile });
});
