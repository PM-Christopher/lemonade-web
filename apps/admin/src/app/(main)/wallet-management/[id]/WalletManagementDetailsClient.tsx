"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "@/components/layouts/MainLayout";
import SkeletonLoader from "@/components/global/SkeletonLoader";
import WithdrawalDecisionModal from "@/modals/wallet-management/WithdrawalDecisionModal";
import UpdateBalance from "@/modals/wallet-management/UpdateBalance";
import PayoutHistoryModal from "@/modals/users/PayoutHistoryModal";
import ReferralHistory from "@/modals/wallet-management/ReferralHistory";
import AffiliateHistory from "@/modals/wallet-management/AffiliateHistory";
import { AppDispatch, RootState } from "@/redux/store";
import { useUserEarningsQuery, useWalletDetailQuery } from "@/features/wallet/queries";
import { useRetryWithdrawalMutation } from "@/features/wallet/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { transactionStatus } from "@/utils/helper";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-6">
    <div className="w-32 shrink-0">
      <p className="text-text-grey text-meta leading-normal font-medium">{label}:</p>
    </div>
    <div className="text-body-s font-medium">{children}</div>
  </div>
);

// One withdrawal request, the wallet behind it and what the user has earned.
function WalletManagementDetailsClient({ id }: { id: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: walletDetail, isLoading } = useWalletDetailQuery(id, { enabled: isLoggedIn });
  const retryMutation = useRetryWithdrawalMutation(id);

  const info = walletDetail?.info;
  const userId = info?.user_id;
  const { data: earnings } = useUserEarningsQuery(userId, { enabled: isLoggedIn });
  const status = info?.status?.toLowerCase();
  const statusView = transactionStatus(info?.status);

  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [balanceAction, setBalanceAction] = useState<"add" | "deduct" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [history, setHistory] = useState<"payout" | "referral" | "affiliate" | null>(null);
  const menu = useRef<HTMLDivElement | null>(null);

  // Closes the Update balance menu on a click elsewhere.
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (menu.current && !menu.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const retryPayout = () => {
    retryMutation.mutate(undefined, {
      onSuccess: (result) => {
        const failed = result.payout_status === "failed";
        dispatch(
          updateToastifyReducer({
            show: true,
            message: failed
              ? `The payout failed again: ${result.failure_reason || "unknown reason"}`
              : apiMessage("Payout retried"),
            type: failed ? "error" : "success",
          }),
        );
      },
    });
  };

  const earningRows: Array<{
    label: string;
    value: number | undefined;
    open?: "payout" | "referral" | "affiliate";
  }> = [
    { label: "Total amount earned", value: earnings?.total_amount, open: "payout" },
    { label: "Referral earning", value: earnings?.referral_earning, open: "referral" },
    { label: "Affiliate earning", value: earnings?.affiliate_earning, open: "affiliate" },
  ];

  return (
    <MainLayout>
      <section className="flex w-full max-w-full flex-col gap-4 overflow-x-hidden p-4 md:gap-5 md:p-5 lg:flex-row lg:items-start">
        <div className="flex h-fit w-full shrink-0 flex-col gap-5 rounded-xl bg-white p-6 lg:w-150">
          {info?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={info.image}
              alt={info.fullname ?? ""}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="bg-light-black h-16 w-16 rounded-full" />
          )}
          {isLoading || !info ? (
            Array.from({ length: 6 }).map((_, index) => <SkeletonLoader key={index} />)
          ) : (
            <>
              <Field label="Full Name">{info.fullname}</Field>
              <Field label="Wallet ID">{info.wallet_id ?? "N/A"}</Field>
              <Field label="Withdrawal Status">
                <span className={statusView.className}>{statusView.label}</span>
              </Field>
              {status === "failed" && info.failure_reason ? (
                <Field label="Failure reason">
                  <span className="text-red-1">{info.failure_reason}</span>
                </Field>
              ) : null}
              <Field label="Account Number">{info.account_number ?? "N/A"}</Field>
              <Field label="Account Holder">{info.account_name ?? "N/A"}</Field>
              <Field label="Bank Name">{info.bank_name ?? "N/A"}</Field>
            </>
          )}

          {status === "pending" && (
            <div className={"flex justify-between gap-4"}>
              <button
                className={"border-light-grey-50 w-full rounded-xl border bg-white px-6 py-2.75"}
                onClick={() => setDecision("reject")}
              >
                <p className={"text-body-l font-medium text-black"}>Reject withdrawal</p>
              </button>
              <button
                className={
                  "border-step-color bg-gradient-green w-full rounded-xl border px-6 py-2.75"
                }
                onClick={() => setDecision("approve")}
              >
                <p className={"text-body-l font-medium text-white"}>Approve withdrawal</p>
              </button>
            </div>
          )}
          {status === "failed" && (
            <button
              className={
                "border-step-color bg-gradient-green w-full rounded-xl border px-6 py-2.75 disabled:opacity-70"
              }
              onClick={retryPayout}
              disabled={retryMutation.isPending}
            >
              <p className={"text-body-l font-medium text-white"}>Retry payout</p>
            </button>
          )}
        </div>

        <div className={"flex w-full flex-1 flex-col rounded-xl bg-white"}>
          <div className={"border-b-grey-20 border-b p-6"}>
            <p className={"font-semiBold text-body-l"}>Wallet summary</p>
          </div>
          <div className={"relative px-6 pt-6 pb-3"} ref={menu}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className={
                "border-light-grey-50 flex h-11 w-fit cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-3"
              }
              onClick={() => setMenuOpen((open) => !open)}
              disabled={!userId}
            >
              <p className={"text-body-s font-medium"}>Update balance</p>
              <ChevronDown className={"w-5"} />
            </button>
            {menuOpen && (
              <ul
                role="menu"
                className="absolute top-full left-6 z-50 mt-1 w-51.75 rounded-xl bg-white shadow"
              >
                {(
                  [
                    ["add", "Add to balance"],
                    ["deduct", "Deduct from balance"],
                  ] as const
                ).map(([action, label]) => (
                  <li key={action} role="none">
                    <button
                      role="menuitem"
                      className="w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setMenuOpen(false);
                        setBalanceAction(action);
                      }}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={"px-6 pb-6"}>
            <div className={"border-mid-grey flex flex-col rounded-xl border-2 p-4"}>
              {earningRows.map((row, index) => (
                <button
                  key={row.label}
                  type="button"
                  disabled={!row.open}
                  className={`flex justify-between p-4 text-left ${
                    index < earningRows.length - 1 ? "border-b-grey-20 border-b" : ""
                  }`}
                  onClick={() => row.open && setHistory(row.open)}
                >
                  <div className={"flex flex-col gap-2"}>
                    <p className={"text-text-grey text-body-s font-normal"}>{row.label}</p>
                    <p className={"font-semiBold text-body-xl"}>
                      ₦{formatNumberWithCommas(row.value || 0)}
                    </p>
                  </div>
                  <ChevronRight />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {decision && (
        <WithdrawalDecisionModal
          isOpen
          toggle={() => setDecision(null)}
          decision={decision}
          withdrawalId={id}
          withdrawal={info}
        />
      )}
      {balanceAction && (
        <UpdateBalance
          isOpen
          toggle={() => setBalanceAction(null)}
          updateType={balanceAction}
          userId={userId}
          balance={info?.balance ? Number(info.balance) : undefined}
        />
      )}
      <PayoutHistoryModal
        isOpen={history === "payout"}
        toggle={() => setHistory(null)}
        userId={userId}
      />
      <ReferralHistory
        isOpen={history === "referral"}
        toggle={() => setHistory(null)}
        affiliateId={userId ?? ""}
      />
      <AffiliateHistory
        isOpen={history === "affiliate"}
        toggle={() => setHistory(null)}
        affiliateId={userId ?? ""}
      />
    </MainLayout>
  );
}

export default WalletManagementDetailsClient;
