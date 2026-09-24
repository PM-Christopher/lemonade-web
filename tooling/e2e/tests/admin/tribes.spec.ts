import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";

// Real create → detail → moderate flow, not just a static route — this
// domain was the last one still on fully static mock content (see
// docs/ARCHITECTURE.md Phase 6's "tribes/page.tsx ... static mock content"
// finding, closed 2026-09-24). Covers the four actions that were unwired:
// create tribe (with a real image upload), add thread, delete thread.
test("admin can create a tribe, post a thread, and delete it", async ({ page }) => {
  test.setTimeout(60_000); // real image upload + two real write round trips

  const tribeName = `E2E Tribe ${Date.now()}`;

  // Cloudinary itself isn't credentialed in this environment — confirmed via
  // the backend log ("Invalid configuration, please set up your
  // environment"), same known gap as Connect's sendChat (see
  // docs/ARCHITECTURE.md). Everything up to that external call is real: the
  // admin-guarded /admin/utilities/upload route, validation, and the
  // multipart request this app sends — only Cloudinary's own response is
  // stubbed, so the rest of the create/add/delete flow below still hits the
  // real backend.
  await page.route("**/api/v1/admin/utilities/upload", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "File uploaded successfully",
        data: { image: "https://res.cloudinary.com/demo/image/upload/e2e-fixture.png" },
      }),
    });
  });

  await page.goto("/tribes");
  await page.getByRole("button", { name: "Create Tribe" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // The mocked upload above resolves near-instantly, so a UI-text wait for
  // "Uploading..." can miss it within one render tick. Waiting on the
  // network response itself is the robust signal that RHF's `image` value
  // actually got set before the rest of the form proceeds.
  const fileInput = dialog.locator('input[type="file"]');
  const uploadResponse = page.waitForResponse("**/api/v1/admin/utilities/upload");
  await fileInput.setInputFiles(
    fileURLToPath(new URL("../../../../apps/admin/public/images/apple.png", import.meta.url)),
  );
  await uploadResponse;

  await dialog.getByLabel("Tribe name").fill(tribeName);

  await dialog.getByRole("combobox", { name: "Category" }).click();
  await page.getByRole("option").first().click();

  await dialog.getByLabel("Description").fill("Created by the tribes e2e spec.");

  await dialog.getByRole("button", { name: "Create tribe" }).click();

  // Real navigation to the new tribe's own detail page, not just a closed
  // modal — proves createTribe's response id round-trips into the redirect.
  await expect(page).toHaveURL(/\/tribes\/[^/]+$/, { timeout: 15_000 });
  await expect(page.getByText(tribeName)).toBeVisible();

  const topic = `E2E topic ${Date.now()}`;
  await page.getByPlaceholder("Topic").fill(topic);
  await page.getByPlaceholder("Write something...").fill("Posted by the tribes e2e spec.");
  await page.getByRole("button", { name: "Post thread" }).click();

  const thread = page.getByText(topic);
  await expect(thread).toBeVisible({ timeout: 15_000 });

  await page.getByRole("button", { name: "Delete thread" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(thread).toHaveCount(0, { timeout: 15_000 });

  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));
  expect(pageErrors, pageErrors.map((e) => e.message).join("\n")).toHaveLength(0);
});
