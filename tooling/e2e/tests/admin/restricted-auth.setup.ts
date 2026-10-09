import { test as setup, expect } from "@playwright/test";

const authFile = ".auth/restricted-admin.json";

// A second admin identity, alongside auth.setup.ts's full-permission one —
// customer-support role, zero permissions (see permission-gating.spec.ts).
setup("authenticate as a restricted admin", async ({ page }) => {
  setup.setTimeout(90_000);

  const email = process.env.E2E_RESTRICTED_ADMIN_EMAIL;
  const password = process.env.E2E_RESTRICTED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "E2E_RESTRICTED_ADMIN_EMAIL and E2E_RESTRICTED_ADMIN_PASSWORD must be set — see tooling/e2e/README.md",
    );
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
