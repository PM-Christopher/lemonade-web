import { test, expect } from "@playwright/test";

// Journey 6 (docs/ARCHITECTURE.md §17): a user requests a payout, an admin
// approves it, and the payout status moves on from "pending". Approving
// sends a real transfer to Paystack's test mode, so the status ends at
// "processing" or "failed" depending on that sandbox, never back at "pending".
const ADMIN_URL = "http://localhost:3001";
const CREDIT = 120000;

interface WithdrawalDetail {
  data: { info: { status: string } };
}

test("a payout request is approved by an admin and leaves pending", async ({ page, browser }) => {
  test.setTimeout(180_000);

  const adminContext = await browser.newContext({
    baseURL: ADMIN_URL,
    storageState: ".auth/admin.json",
  });
  const admin = adminContext.request;

  try {
    // Fund the demo user's wallet above the payout minimum.
    const email = process.env.E2E_USER_EMAIL;
    const found = await admin.get(`/api/v1/admin/users?search=${encodeURIComponent(email ?? "")}`);
    expect(found.ok()).toBeTruthy();
    const { data: users } = (await found.json()) as {
      data: { users: { id: string; email: string }[] };
    };
    const userId = users.users.find((user) => user.email === email)?.id;
    expect(userId, "demo user not found").toBeTruthy();

    const credit = await admin.patch(`/api/v1/admin/wallet/user/${userId}/add`, {
      data: { amount: CREDIT },
    });
    expect(credit.ok(), await credit.text()).toBeTruthy();

    // The payout goes to a bank account on file.
    const bank = await page.request.get("/api/v1/user/profile/bank-account");
    const hasBank = bank.ok() && (await bank.text()).includes("account_number");
    if (!hasBank) {
      const created = await page.request.post("/api/v1/user/profile/bank-account/create-account", {
        data: {
          bank_name: "Zenith Bank",
          account_name: "Demo User",
          account_number: "0000000000",
          bank_code: "057",
        },
      });
      expect(created.ok(), await created.text()).toBeTruthy();
    }

    // The user requests the payout from the wallet page.
    await page.goto("/settings/wallet");
    // Wait for the profile to load, or the button opens the bank account modal.
    const payoutButton = page.getByRole("button", { name: /request pay ?out/i });
    await expect(payoutButton).toBeEnabled({ timeout: 30_000 });
    await page.waitForLoadState("networkidle");
    const requested = page.waitForResponse(
      (response) =>
        response.url().includes("/request-payout") && response.request().method() === "POST",
    );
    await payoutButton.click();
    const requestResponse = await requested;
    expect(requestResponse.ok(), await requestResponse.text()).toBeTruthy();
    const { data: payout } = (await requestResponse.json()) as {
      data: { withdrawal_request_id: string };
    };
    const withdrawalId = payout.withdrawal_request_id;

    const statusOf = async () => {
      const response = await admin.get(
        `/api/v1/admin/transaction/wallet-withdrawal/${withdrawalId}`,
      );
      expect(response.ok()).toBeTruthy();
      return ((await response.json()) as WithdrawalDetail).data.info.status.toLowerCase();
    };
    expect(await statusOf()).toBe("pending");

    // The admin approves it from the admin app.
    const adminPage = await adminContext.newPage();
    await adminPage.goto(`/wallet-management/${withdrawalId}`);
    await adminPage.getByRole("button", { name: "Approve Withdrawal" }).click();
    await adminPage.getByRole("dialog").getByRole("button", { name: "Approve" }).click();

    await expect.poll(statusOf, { timeout: 60_000 }).not.toBe("pending");
    expect(["approved", "processing", "failed", "paid"]).toContain(await statusOf());
  } finally {
    await adminContext.close();
  }
});
