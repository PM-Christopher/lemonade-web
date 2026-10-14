import { fileURLToPath } from "node:url";
import { test, expect, type Page } from "@playwright/test";

// Journey 3 (docs/ARCHITECTURE.md §17): create an event, add a ticket type,
// publish. Publishing submits the event for admin review (status "pending"),
// and it only goes live once an admin approves it.
interface EventDetail {
  event_name: string;
  status: string;
  tickets: { name: string; ticket_type: string; price: number; purchase_limit: number }[];
}

const ADMIN_URL = "http://localhost:3001";

// The user's own events are grouped by status (drafts, pending, upcoming, ...).
async function eventBucket(page: Page, eventName: string): Promise<string | undefined> {
  const response = await page.request.get("/api/v1/user/events");
  expect(response.ok()).toBeTruthy();
  const { data } = (await response.json()) as { data: Record<string, { event_name: string }[]> };
  return Object.entries(data).find(([, events]) =>
    events.some((event) => event.event_name === eventName),
  )?.[0];
}

function isoDate(daysFromNow: number): string {
  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
}

test("a user creates an event with a ticket and publishes it", async ({ page, browser }) => {
  test.setTimeout(150_000);

  const eventName = `E2E Event ${Date.now()}`;

  // Cloudinary isn't credentialed here (same gap as admin/tribes.spec.ts), so
  // only the upload response is stubbed. Everything else hits the real backend.
  await page.route("**/api/v1/shared/utilities/upload", async (route) => {
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

  await page.goto("/event/create-event");

  const uploaded = page.waitForResponse("**/api/v1/shared/utilities/upload");
  await page
    .locator('input[type="file"]')
    .first()
    .setInputFiles(
      fileURLToPath(new URL("../../../../apps/admin/public/images/apple.png", import.meta.url)),
    );
  await uploaded;

  await page.locator("#event-name").fill(eventName);
  await page.locator("textarea").first().fill("Created by the event e2e spec.");
  await page.locator("select").first().selectOption("spirituality");
  await page.getByText("Physical", { exact: true }).click();
  await page.getByPlaceholder("Enter location...").fill("Lagos");
  await page.locator("#event-time-zone").selectOption({ index: 1 });

  // react-datepicker accepts typed text in its display format.
  for (const [placeholder, value] of [
    ["From", isoDate(60)],
    ["Start Time", "10:00 AM"],
    ["End Date", isoDate(60)],
    ["End Time", "6:00 PM"],
  ] as const) {
    const input = page.getByPlaceholder(placeholder);
    await input.fill(value);
    await input.press("Enter");
  }

  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/event\/add-ticket/, { timeout: 30_000 });

  await page.getByText("Paid", { exact: true }).click();
  await page.locator("#ticket-name-0").fill("General admission");
  await page.locator("#ticket-price-0").fill("5000");
  await page.locator('select[name="tickets.0.stock_type"]').selectOption("unlimited");
  await page.locator("#ticket-limit-0").fill("5");
  await page.locator('textarea[name="tickets.0.description"]').fill("One entry.");

  const created = page.waitForResponse(
    (response) =>
      response.url().includes("/api/v1/user/events/create-event") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Publish" }).click();
  const createResponse = await created;
  expect(createResponse.ok(), await createResponse.text()).toBeTruthy();
  await expect(page).toHaveURL(/\/event$/, { timeout: 30_000 });

  // The owner can read the new event back, with its ticket, waiting for review.
  const { data: createdBody } = (await createResponse.json()) as {
    data: { event: { id: string } };
  };
  const eventId = createdBody.event.id;
  const detail = await page.request.get(`/api/v1/user/events/${eventId}`);
  expect(detail.ok()).toBeTruthy();
  const { data } = (await detail.json()) as { data: { event: EventDetail } };
  expect(data.event.event_name).toBe(eventName);
  expect(data.event.status.toLowerCase()).toBe("pending");
  expect(data.event.tickets).toHaveLength(1);
  expect(data.event.tickets[0]).toMatchObject({
    name: "General admission",
    ticket_type: "paid",
    price: 500000,
    purchase_limit: 5,
  });
  expect(await eventBucket(page, eventName)).toBe("pending");

  // An admin approves it from the admin app, and it goes live.
  const adminContext = await browser.newContext({
    baseURL: ADMIN_URL,
    storageState: ".auth/admin.json",
  });
  try {
    const adminPage = await adminContext.newPage();
    await adminPage.goto(`/events/${eventId}`);
    await adminPage.getByRole("button", { name: "Approve" }).click();
    await expect(adminPage.getByText("Flag event")).toBeVisible({ timeout: 30_000 });

    await expect.poll(() => eventBucket(page, eventName), { timeout: 30_000 }).toBe("upcoming");
  } finally {
    // Leave no test event behind, whatever happened above.
    await adminContext.request.delete(`/api/v1/admin/events/${eventId}/delete-event`);
    await adminContext.close();
  }
});
