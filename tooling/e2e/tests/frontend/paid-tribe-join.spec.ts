import { test, expect, type APIRequestContext } from "@playwright/test";

// Journey 5 (docs/ARCHITECTURE.md §17), partial: joining a paid tribe starts a
// real Paystack payment. Paystack's hosted checkout is behind a Cloudflare bot
// challenge (see journey 4), so the payment can't be completed here. What this
// checks is everything before it: the join returns a live checkout URL, the
// user is not a member yet, and no money moved to the creator.
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

    // The tribe page can't start this from the UI: a non-member is denied the
    // paid tribe's detail (403), so its "Unlock Tribe content" button never
    // renders. This sends the request that button sends. See README.md.
    const join = await page.request.post(`/api/v1/user/tribes/join-tribe/${tribe.slug}`, {
      data: { redirect_url: `http://localhost:3000/tribe/${tribe.slug}` },
    });
    expect(join.ok(), await join.text()).toBeTruthy();
    const { data: joined } = (await join.json()) as { data: { authorization_url?: string } };
    expect(joined.authorization_url).toMatch(/^https:\/\/checkout\.paystack\.com\//);

    // Not a member until the payment is verified, and no creator credit yet.
    // The detail is still denied, which is how the backend reports "not a member".
    const detail = await page.request.get(`/api/v1/user/tribes/${tribe.slug}`);
    expect(detail.status()).toBe(403);
    expect(await creatorLedgerTotal(adminContext.request)).toBe(ledgerBefore);
  } finally {
    await adminContext.close();
  }
});
