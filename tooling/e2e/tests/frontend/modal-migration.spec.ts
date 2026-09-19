import { test, expect } from "@playwright/test";

// Phase 7's modal migration (docs/ARCHITECTURE.md) replaced every hand-built
// overlay div with @lemonade/ui's Dialog/DialogContentBare. CreateTribeModal
// is a good real-world check: it's next/dynamic-lazy-loaded and uses
// non-standard prop names (modalFlag/activateModal, not isOpen/toggle) —
// exactly the kind of deviation the mechanical conversion had to handle
// correctly rather than just the common case.

test("+ Create Tribe opens a real Dialog on /tribe, Escape closes it", async ({ page }) => {
  await page.goto("/tribe");

  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));

  const createButton = page.getByText("Create Tribe", { exact: false });
  await expect(createButton).toBeVisible({ timeout: 15_000 });
  await createButton.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  // Two matches — the visible heading and the sr-only DialogTitle that
  // gives the dialog its accessible name — .first() avoids a Playwright
  // strict-mode violation on that duplicate text.
  await expect(dialog.getByText("Create Tribe", { exact: false }).first()).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);

  expect(pageErrors, pageErrors.map((e) => e.message).join("\n")).toHaveLength(0);
});
