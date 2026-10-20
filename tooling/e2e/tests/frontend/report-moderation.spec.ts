import { test, expect, type APIRequestContext } from "@playwright/test";

// Journey 8 (docs/ARCHITECTURE.md §17): a user reports a thread, an admin
// finds the report and resolves it, and the reporter is notified.
interface Tribe {
  id: string;
  slug: string;
  monetized: number | boolean;
  private: boolean;
}
interface ReportRow {
  id: number;
  unique_id: string;
  status: string;
}
interface ReportListResponse {
  data: { reports: ReportRow[] };
}

const ADMIN_URL = "http://localhost:3001";

async function listReports(admin: APIRequestContext): Promise<ReportRow[]> {
  const response = await admin.get("/api/v1/admin/reports");
  expect(response.ok()).toBeTruthy();
  return ((await response.json()) as ReportListResponse).data.reports;
}

async function reportIds(admin: APIRequestContext): Promise<Set<number>> {
  return new Set((await listReports(admin)).map((report) => report.id));
}

test("a reported thread reaches the admin queue and can be resolved", async ({ page, browser }) => {
  test.setTimeout(150_000);

  const adminContext = await browser.newContext({
    baseURL: ADMIN_URL,
    storageState: ".auth/admin.json",
  });
  const adminPage = await adminContext.newPage();

  try {
    const idsBefore = await reportIds(adminContext.request);

    // Pick a free public tribe and make sure the demo user is a member.
    const tribesResponse = await page.request.get("/api/v1/user/tribes?type=discover");
    expect(tribesResponse.ok()).toBeTruthy();
    const { data: tribesData } = (await tribesResponse.json()) as { data: { tribes: Tribe[] } };
    const tribe = tribesData.tribes.find((t) => !t.monetized && !t.private);
    expect(tribe, "no free public tribe in the seed data").toBeTruthy();
    if (!tribe) return;

    await page.request.post(`/api/v1/user/tribes/join-tribe/${tribe.slug}`, {
      data: { redirect_url: null },
    });

    // A fresh thread, so the report is easy to tell apart.
    const topic = `E2E report ${Date.now()}`;
    const created = await page.request.post(
      `/api/v1/user/tribes/${tribe.id}/threads/create-thread`,
      {
        data: { topic, thoughts: "Created by the report e2e spec.", polls: false },
      },
    );
    expect(created.ok(), await created.text()).toBeTruthy();

    // The user reports it through the UI.
    await page.goto(`/tribe/${tribe.slug}`);
    const thread = page.locator('div[id^="pinned-"]', { hasText: topic });
    await expect(thread).toBeVisible({ timeout: 45_000 });
    // The "more" icon is the first svg in the card header.
    await thread.locator("svg").first().click();
    await page.getByText("Report Thread").click();

    const reportResponse = page.waitForResponse(
      (response) =>
        response.url().includes("/report-thread") && response.request().method() === "POST",
    );
    await page.getByRole("button", { name: "Submit" }).click();
    expect((await reportResponse).ok()).toBeTruthy();

    // The admin finds the new report and resolves it from the UI.
    await expect
      .poll(async () => (await reportIds(adminContext.request)).size)
      .toBe(idsBefore.size + 1);
    const idsAfter = await reportIds(adminContext.request);
    const reportId = [...idsAfter].find((id) => !idsBefore.has(id));

    const report = (await listReports(adminContext.request)).find((row) => row.id === reportId);
    expect(report?.status).toBe("pending");

    await adminPage.goto(`/reporting/${reportId}`);
    await expect(adminPage.getByText(report?.unique_id ?? "")).toBeVisible({ timeout: 45_000 });
    await expect(adminPage.getByText("Pending")).toBeVisible();
    await adminPage.getByRole("button", { name: "Make as resolved" }).click();
    // The confirmation dialog asks first.
    await adminPage.getByRole("dialog").getByRole("button", { name: "Resolve" }).click();
    await expect(adminPage.getByText("Resolved", { exact: true })).toBeVisible({ timeout: 30_000 });

    const resolved = (await listReports(adminContext.request)).find((row) => row.id === reportId);
    expect(resolved?.status).toBe("completed");

    // The reporter is told it was reviewed.
    const notifications = await page.request.get("/api/v1/user/notification");
    expect(notifications.ok()).toBeTruthy();
    expect(await notifications.text()).toContain("Your report was reviewed");
  } finally {
    await adminContext.close();
  }
});
