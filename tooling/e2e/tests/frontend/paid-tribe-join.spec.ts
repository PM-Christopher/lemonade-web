import { test, expect, type APIRequestContext } from "@playwright/test";

// Journey 5 (docs/ARCHITECTURE.md §17), partial: joining a paid tribe starts a
// real Paystack payment. Paystack's hosted checkout is behind a Cloudflare bot
// challenge (see journey 4), so the payment can't be completed here. What this
// checks is everything before it: the join goes to a live checkout, the user is
// not a member yet and can't read the threads, and no money moved to the creator.
// The creator credit (ledger postings after a verified payment) is covered by
// the backend's own tests, not by this suite.
const ADMIN_URL = "http://localhost:3001";

interface Tribe {
  slug: string;
  monetized: number | boolean;
  private: boolean;
  has_joined: boolean;
  owner: boolean;
}

async function creatorLedgerTotal(request: APIRequestContext): Promise<number> {
  const response = await request.get(
    "/api/v1/admin/transaction/ledger?account_type=tribe_owner&per_page=1",
  );
  expect(response.ok()).toBeTruthy();
  const { data } = (await response.json()) as { data: { meta: { total: number } } };
  return data.meta.total;
}

test("joining a paid tribe returns a checkout URL and does not grant membership yet", async ({
  page,
  browser,
}) => {
  test.setTimeout(120_000);

  const adminContext = await browser.newContext({
    baseURL: ADMIN_URL,
    storageState: ".auth/admin.json",
  });

  try {
    const listed = await page.request.get("/api/v1/user/tribes?type=discover");
    expect(listed.ok()).toBeTruthy();
    const { data } = (await listed.json()) as { data: { tribes: Tribe[] } };
    const tribe = data.tribes.find((t) => t.monetized && !t.private && !t.has_joined && !t.owner);
    expect(tribe, "no paid public tribe to join in the seed data").toBeTruthy();
    if (!tribe) return;

    const ledgerBefore = await creatorLedgerTotal(adminContext.request);

    // A non-member sees the paid tribe's summary and a way to unlock it.
    await page.goto(`/tribe/${tribe.slug}`);
    await page.getByText("Unlock Tribe content").click();
    await page.getByRole("button", { name: "Join Tribe now" }).click();
    await page.waitForURL(/checkout\.paystack\.com/, { timeout: 45_000, waitUntil: "commit" });

    // Not a member until the payment is verified, and no creator credit yet.
    const detail = await page.request.get(`/api/v1/user/tribes/${tribe.slug}`);
    expect(detail.ok()).toBeTruthy();
    const { data: tribeData } = (await detail.json()) as {
      data: { tribe: Tribe; threads: unknown[] };
    };
    expect(tribeData.tribe.has_joined).toBe(false);
    expect(tribeData.threads).toEqual([]);
    const threads = await page.request.get(`/api/v1/user/tribes/${tribe.slug}/threads/all`);
    expect(threads.status()).toBe(403);
    expect(await creatorLedgerTotal(adminContext.request)).toBe(ledgerBefore);
  } finally {
    await adminContext.close();
  }
});
