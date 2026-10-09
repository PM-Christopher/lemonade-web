import { test as setup, expect } from "@playwright/test";

const authFile = ".auth/user.json";

setup("authenticate as a real user", async ({ page }) => {
  setup.setTimeout(90_000);

  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;
  if (!email || !password) {
    throw new Error("E2E_USER_EMAIL and E2E_USER_PASSWORD must be set — see tooling/e2e/README.md");
  }

  await page.goto("/login");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  // next dev compiles the destination on first hit — wait for URL, not just the form.
  await expect(page).toHaveURL((url) => !url.pathname.startsWith("/login"), {
    timeout: 60_000,
  });

  await page.context().storageState({ path: authFile });
});
