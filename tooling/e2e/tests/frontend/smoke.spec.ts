import { test, expect } from "@playwright/test";

// Broad, cheap coverage: every top-level authenticated route, visited once,
// asserting nothing crashes client-side. This is the check curl-based
// smoke tests elsewhere in this repo can't do — curl never executes
// JavaScript, so a client-side throw (like the real Firebase messaging
// crash this suite's first real run caught — see src/lib/firebase.ts) is
// invisible to it. See docs/ARCHITECTURE.md §17 and tooling/e2e/README.md.
const ROUTES = ["/", "/event", "/tribe", "/business", "/connect", "/settings"];

for (const route of ROUTES) {
  test(`${route} renders without a client-side error`, async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));

    const response = await page.goto(route);
    expect(response?.ok(), `${route} returned ${response?.status()}`).toBeTruthy();

    // Next's dev error overlay renders instead of the page on an unhandled
    // client error — check for it explicitly, since the page still
    // returns a 200 HTML shell either way.
    await expect(page.getByText("Unhandled Runtime Error")).toHaveCount(0);

    expect(pageErrors, pageErrors.map((e) => e.message).join("\n")).toHaveLength(0);
  });
}
