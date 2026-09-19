import { test, expect } from "@playwright/test";

// Phase 7's modal migration (docs/ARCHITECTURE.md) replaced every hand-built
// overlay div with @lemonade/ui's Dialog/DialogContentBare. These are real
// browser checks that a converted, next/dynamic-lazy-loaded modal still
// opens from its real trigger and Escape actually closes it (Radix's own
// behavior, not hand-rolled anymore) — not just typecheck/build.

test("Add promotion opens a real Dialog on /events/add-promotions, Escape closes it", async ({
  page,
}) => {
  await page.goto("/events/add-promotions");

  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));

  await page.getByText("Add promotion", { exact: true }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);

  expect(pageErrors, pageErrors.map((e) => e.message).join("\n")).toHaveLength(0);
});

test("Edit withdrawal threshold opens a real Dialog on /wallet-management, Escape closes it", async ({
  page,
}) => {
  await page.goto("/wallet-management");

  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));

  const editButton = page.getByText("Edit", { exact: true });
  await expect(editButton).toBeVisible({ timeout: 15_000 });
  await editButton.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);

  expect(pageErrors, pageErrors.map((e) => e.message).join("\n")).toHaveLength(0);
});
