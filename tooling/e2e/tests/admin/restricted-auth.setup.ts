import { test as setup, expect } from "@playwright/test";

const authFile = ".auth/restricted-admin.json";

// A second admin identity, alongside auth.setup.ts's full-permission one —
// customer-support role, zero permissions (see permission-gating.spec.ts).
// File-based storageState, computed once, same as auth.setup.ts and for the
// same reason: a live login per test would blow through the backend's
// throttle:auth (5/min) once retries pile up.
setup("authenticate as a restricted admin", async ({ page }) => {
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

  await expect(page.locator("#password")).toHaveCount(0, { timeout: 15_000 });

  await page.context().storageState({ path: authFile });
});
