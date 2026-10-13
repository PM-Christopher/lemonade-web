import { test, expect, type Page } from "@playwright/test";

// Journey 7 (docs/ARCHITECTURE.md §17): an admin adjusts a user's balance
// and a ledger entry shows up. The credit is undone with a deduct, so the
// seeded wallet ends where it started.
const AMOUNT = "150";

interface LedgerEntry {
  entry_type: "credit" | "debit";
  amount: string;
  balance_after_minor: number;
}
interface LedgerResponse {
  data: { entries: LedgerEntry[]; meta: { total: number } };
}

// Newest entry first, plus the wallet's entry count.
async function readLedger(page: Page, userId: string) {
  const response = await page.request.get(
    `/api/v1/admin/transaction/ledger?account_type=user_wallet&account_id=${userId}&per_page=1`,
  );
  expect(response.ok()).toBeTruthy();
  const { data } = (await response.json()) as LedgerResponse;
  return { total: data.meta.total, latest: data.entries[0] };
}

async function adjustBalance(page: Page, menuItem: "Add to balance" | "Deduct from balance") {
  await page.getByText("Update balance").click();
  await page.getByText(menuItem, { exact: true }).click();
  await page.locator("#amount").fill(AMOUNT);
  await page.getByRole("button", { name: "Confirm" }).click();
  await expect(page.locator("#amount")).toHaveCount(0);
}

test("admin credits then debits a user wallet and the ledger records both", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/users", { waitUntil: "domcontentloaded" });

  const row = page.getByRole("row", { name: /Demo User/ });
  await expect(row).toBeVisible({ timeout: 30_000 });
  await row.click();
  await expect(page).toHaveURL(/\/users\/[^/]+$/, { timeout: 45_000 });
  const userId = page.url().split("/").pop() as string;

  await page.getByText("Wallet", { exact: true }).click();
  const before = await readLedger(page, userId);
  const startBalance = before.latest?.balance_after_minor ?? 0;

  await adjustBalance(page, "Add to balance");
  await expect.poll(async () => (await readLedger(page, userId)).total).toBe(before.total + 1);
  const credit = (await readLedger(page, userId)).latest;
  expect(credit).toMatchObject({ entry_type: "credit", amount: `${AMOUNT}.00` });
  expect(credit?.balance_after_minor).toBe(startBalance + Number(AMOUNT) * 100);

  await adjustBalance(page, "Deduct from balance");
  await expect.poll(async () => (await readLedger(page, userId)).total).toBe(before.total + 2);
  const debit = (await readLedger(page, userId)).latest;
  expect(debit).toMatchObject({ entry_type: "debit", amount: `${AMOUNT}.00` });
  expect(debit?.balance_after_minor).toBe(startBalance);
});
