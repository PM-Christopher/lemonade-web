import { test, expect } from "@playwright/test";

// Real list → detail navigation — same rationale as admin/users-detail.spec.ts:
// exercises real dynamic-data flows, not just static routes, and a real
// click is what actually loads the [id] page's data-fetching code path.
//
// Excludes /event — this e2e user account has no events to click into
// (confirmed: no `a[href^="/event/"]` renders at all after a 15s wait, and
// the page logs a real if non-fatal console error — "An empty string was
// passed to the src attribute" — on an image somewhere in the card/list
// component, worth a look separately but not chased down here). A test
// asserting on a click target that doesn't exist isn't testing anything;
// add this back once the seed data has real events for this account.
const CASES = [
  { list: "/tribe", linkPrefix: "/tribe/", label: "tribe" },
  { list: "/business", linkPrefix: "/business/", label: "business" },
];

for (const { list, linkPrefix, label } of CASES) {
  test(`clicking a real ${label} card navigates to its detail page`, async ({ page }) => {
    await page.goto(list, { waitUntil: "domcontentloaded" });

    const link = page.locator(`a[href^="${linkPrefix}"]`).first();
    await expect(link).toBeVisible({ timeout: 15_000 });
    await link.click();

    await expect(page).toHaveURL(new RegExp(`${linkPrefix.replace("/", "\\/")}[^/]+`), {
      timeout: 20_000,
    });

    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));
    await expect(page.getByText("Unhandled Runtime Error")).toHaveCount(0);
    expect(pageErrors, pageErrors.map((e) => e.message).join("\n")).toHaveLength(0);
  });
}
