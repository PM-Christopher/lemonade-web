import { test, expect } from "@playwright/test";

// docs/ARCHITECTURE.md §22 Conflict 2 — the 8 admin route groups are now
// gated by per-section permissions, and the frontend mirrors that: an admin
// lacking a section's <section>.write permission gets neither the nav item
// nor a working direct URL (real 404), not just a hidden button. This spec
// proves that with a real restricted admin against the real backend, not a
// mock — the same rigor as the rest of this suite.

// middleware.ts checks the admin's permissions before any page renders and
// rewrites to a nonexistent path when the section is gated, so every one of
// these gets a real HTTP 404 — including /tribes, even though its page is a
// Client Component. (An earlier version of this gate lived only in
// page.tsx via requireAdminPermission()/notFound(), which renders the right
// content but can't correct the status code once a cookie-dependent Server
// Component's response starts streaming — confirmed with an isolated
// reproduction, not assumed. See middleware.ts's comment and
// docs/ARCHITECTURE.md §22 Conflict 2.)
const GATED_ROUTES = [
  "/wallet-management",
  "/users",
  "/businesses",
  "/tribes",
  "/events",
  "/subscriptions",
  "/reporting",
  "/team",
];

test.describe("full-permission admin", () => {
  test("sees every gated section in the sidebar", async ({ page }) => {
    await page.goto("/");
    for (const name of [
      "Wallet management",
      "Users",
      "Businesses",
      "Tribes",
      "Events",
      "Subscriptions",
      "Reporting",
      "Team members",
    ]) {
      await expect(page.getByRole("link", { name })).toBeVisible();
    }
  });
});

test.describe("restricted admin (no section permissions)", () => {
  // File-based storageState from restricted-auth.setup.ts, same pattern as
  // the full-permission admin project — this admin has the customer-support
  // role with zero permissions (see AdminWritePermissionTest in
  // lemonade-backend for the same role used server-side). Deliberately NOT
  // a live login in this file: a beforeAll login combined with retries can
  // re-run per retry, and this block has more assertions than the backend's
  // throttle:auth middleware allows login attempts per minute (5) — found
  // by hitting exactly that while writing this spec.
  test.use({ storageState: ".auth/restricted-admin.json" });

  test("sidebar hides every gated section", async ({ page }) => {
    await page.goto("/");
    for (const name of [
      "Wallet management",
      "Users",
      "Businesses",
      "Tribes",
      "Events",
      "Subscriptions",
      "Reporting",
      "Team members",
    ]) {
      await expect(page.getByRole("link", { name })).toHaveCount(0);
    }
    // Ungated sections stay visible — not everything vanishes.
    await expect(page.getByRole("link", { name: "Overview" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Transactions" })).toBeVisible();
  });

  for (const route of GATED_ROUTES) {
    test(`direct navigation to ${route} 404s`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(404);
      await expect(page.getByText(/this page could not be found/i)).toBeVisible();
    });
  }

  test("ungated routes stay reachable", async ({ page }) => {
    const response = await page.goto("/transactions");
    expect(response?.ok(), `/transactions returned ${response?.status()}`).toBeTruthy();
  });
});
