import { test, expect } from "@playwright/test";

// Same rationale as tests/frontend/smoke.spec.ts — see that file's header.
const ROUTES = [
  "/",
  "/users",
  "/events",
  "/transactions",
  "/wallet-management",
  "/team",
  "/reporting",
  "/announcements",
  "/tribes",
  "/businesses",
  "/profile",
];

for (const route of ROUTES) {
  test(`${route} renders without a client-side error`, async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));

    const response = await page.goto(route);
    expect(response?.ok(), `${route} returned ${response?.status()}`).toBeTruthy();

    await expect(page.getByText("Unhandled Runtime Error")).toHaveCount(0);

    expect(pageErrors, pageErrors.map((e) => e.message).join("\n")).toHaveLength(0);
  });
}
