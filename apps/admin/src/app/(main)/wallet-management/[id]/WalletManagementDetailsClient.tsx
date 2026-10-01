"use client";
import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { ChevronDown, ChevronRight } from "lucide-react";
import WithdrawalApproval from "@/modals/wallet-management/WithdrawalApproval";
import WithdrawalReject from "@/modals/wallet-management/WithdrawalReject";
import UpdateBalance from "@/modals/wallet-management/UpdateBalance";
import PayoutHistory from "@/modals/wallet-management/PayoutHistory";
import ReferralHistory from "@/modals/wallet-management/ReferralHistory";
import AffiliateHistory from "@/modals/wallet-management/AffiliateHistory";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useWalletDetailQuery } from "@/features/wallet/queries";
import SkeletonLoader from "@/components/global/SkeletonLoader";
import { capitalizeWords } from "@/utils/helper";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import dayjs from "dayjs";

function WalletManagementDetailsClient({ id }: { id: string }) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isRejectOpen, setIsRejectOpen] = React.useState<boolean>(false);
  const [isUpdateOpen, setIsUpdateOpen] = React.useState<boolean>(false);
  // Always "add" today — nothing in this component ever switches it to
  // "deduct", so this is a constant, not state. UpdateBalance.tsx's own
  // deduct path (if it has one) isn't reachable from here.
  const updateType = "add";

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const { data: walletDetail, isLoading: walletLoading } = useWalletDetailQuery(id, {
    enabled: isLoggedIn,
  });

  // side menu state
  const [isPayoutOpen, setIsPayoutOpen] = React.useState(false);
  const [isReferralOpen, setIsReferralOpen] = React.useState(false);
  const [isAffiliateOpen, setIsAffiliateOpen] = React.useState(false);

  const toggleWithdrawalAction = () => {
    setIsOpen(!isOpen);
  };
  const toggleWithdrawalReject = () => {
    setIsRejectOpen(!isRejectOpen);
  };
  const toggleUpdateBalance = () => {
    setIsUpdateOpen(!isUpdateOpen);
  };
  // side menu toggles
  const togglePayoutHistory = () => {
    setIsPayoutOpen(!isPayoutOpen);
  };

  const toggleReferralHistory = () => {
    setIsReferralOpen(!isReferralOpen);
  };

  const toggleAffiliateHistory = () => {
    setIsAffiliateOpen(!isAffiliateOpen);
  };

  const formatValue = (value: unknown): string => {
    if (typeof value === "object" && value !== null) {
      return Object.entries(value)
        .map(([key, val]) => `${capitalizeWords(key)}: ${val}`)
        .join(", ");
    }
    return capitalizeWords(String(value || "N/A"));
  };

  return (
    <MainLayout>
      <section className="flex w-full max-w-full flex-row gap-4 overflow-x-hidden p-4 md:gap-5 md:p-5 lg:flex-col">
        <div className={"flex h-fit w-[600px] flex-col gap-5 rounded-xl bg-white p-6"}>
          {/* <div
            className={"w-16 h-16 rounded-full bg-light-black"}
          ></div> */}

          {walletDetail?.info ? (
            Object.entries(walletDetail?.info)
              .filter(([key]) => key !== "amount") // Exclude 'amount'
              .map(([key, value]) => (
                <div key={key} className="flex items-center gap-6">
                  <div className="w-[115px]">
                    <p className="text-text-grey text-[12px] font-medium">
                      {capitalizeWords(key.replace(/_/g, " "))}:
                    </p>
                  </div>
                  {walletLoading ? (
                    <SkeletonLoader />
                  ) : (
                    <p className="text-[14px] font-medium">
                      {key === "date_paid"
                        ? dayjs(value as string).format("YYYY-MM-DD hh:mm:ssA")
                        : formatValue(value)}
                    </p>
                  )}
                </div>
              ))
          ) : (
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-[50px]">
                  <div className="w-[115px]">
                    {/* Skeleton for the label */}
                    <SkeletonLoader />
                  </div>
                  {/* Skeleton for the value */}
                  <SkeletonLoader />
                </div>
              ))}
            </>
          )}

          {/* && walletDetail.status === "pending"  */}
          {walletDetail && walletDetail?.info?.status?.toLowerCase() !== "approved" && (
            <div className={"flex justify-between gap-4"}>
              <button
                className={"border-light-grey-50 w-full rounded-xl border bg-white px-12 py-[11px]"}
                onClick={toggleWithdrawalReject}
              >
                <p className={"text-[16px] font-medium text-black"}>Reject withdrawal</p>
              </button>
              <button
                className={
                  "border-step-color bg-gradient-green w-full rounded-xl border px-12 py-[11px]"
                }
                onClick={toggleWithdrawalAction}
              >
                <p className={"text-[16px] font-medium text-white"}>Approve Withdrawal</p>
              </button>
            </div>
          )}
        </div>

        {/* details */}
        <div className={"flex h-[762px] w-full flex-col rounded-xl bg-white lg:w-2/3"}>
          <div className={"border-b-grey-20 border-b p-6"}>
            <p className={"font-semiBold text-[16px]"}>Wallet summary</p>
          </div>
          <div className={"px-6 pt-6 pb-3"}>
            <div
              className={
                "border-light-grey-50 flex h-11 w-fit cursor-pointer items-center gap-2 rounded-xl border bg-none px-3.5 py-3"
              }
              onClick={toggleUpdateBalance}
            >
              <div className={"flex items-center justify-between"}>
                <p className={"text-[14px] font-medium"}>Update Balance</p>
              </div>
              <ChevronDown className={"w-5"} />
            </div>
          </div>
          <div className={"px-6 pb-6"}>
            <div className={"border-mid-grey flex flex-col rounded-xl border-2 p-4"}>
              <div className={"border-b-grey-20 flex cursor-pointer justify-between border-b p-4"}>
                <div className={"flex flex-col gap-2"}>
                  <p className={"text-text-grey text-[14px] font-normal"}>Total amount earned</p>
                  <p className={"font-semiBold text-[18px]"}>
                    ₦ {formatNumberWithCommas(walletDetail?.history[0]?.wallet?.balance || 0)}
                  </p>
                </div>
                <ChevronRight className={"cursor-pointer"} />
              </div>
              <div className={"border-b-grey-20 flex cursor-pointer justify-between border-b p-4"}>
                <div className={"flex flex-col gap-2"}>
                  <p className={"text-text-grey text-[14px] font-normal"}>Referral earning</p>
                  <p className={"font-semiBold text-[18px]"}> ₦ {formatNumberWithCommas(0)}</p>
                </div>
                <ChevronRight className={"cursor-pointer"} />
              </div>
              <div className={"flex cursor-pointer justify-between p-4"}>
                <div className={"flex flex-col gap-2"}>
                  <p className={"text-text-grey text-[14px] font-normal"}>Affiliate earning</p>
                  <p className={"font-semiBold text-[18px]"}> ₦ {formatNumberWithCommas(0)}</p>
                </div>
                <ChevronRight className={"cursor-pointer"} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <WithdrawalApproval isOpen={isOpen} toggle={toggleWithdrawalAction} />
      <WithdrawalReject isOpen={isRejectOpen} toggle={toggleWithdrawalReject} />
      <UpdateBalance
        isOpen={isUpdateOpen}
        toggle={toggleUpdateBalance}
        updateType={updateType}
        balance={walletDetail?.history[0]?.wallet?.balance}
      />

      <PayoutHistory isOpen={isPayoutOpen} toggle={togglePayoutHistory} />
      <ReferralHistory isOpen={isReferralOpen} toggle={toggleReferralHistory} />
      <AffiliateHistory isOpen={isAffiliateOpen} toggle={toggleAffiliateHistory} />
    </MainLayout>
  );
}

export default WalletManagementDetailsClient;
