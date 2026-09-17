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

function WalletManagementDetailsClient({ id }: { id: number | undefined }) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isRejectOpen, setIsRejectOpen] = React.useState<boolean>(false);
  const [isUpdateOpen, setIsUpdateOpen] = React.useState<boolean>(false);
  const [updateType, setUpdateType] = React.useState<string>("add");

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const { data: walletDetail, isLoading: walletLoading } = useWalletDetailQuery(
    id,
    {
      enabled: isLoggedIn,
    },
  );

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
  const updateBalanceType = (type: string) => {
    setUpdateType(type);
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

  const formatValue = (value: any): string => {
    if (typeof value === "object" && value !== null) {
      return Object.entries(value)
        .map(([key, val]) => `${capitalizeWords(key)}: ${val}`)
        .join(", ");
    }
    return capitalizeWords(String(value || "N/A"));
  };

  return (
    <MainLayout>
      <section className="md:p-5 lg:flex-col md:gap-5 flex w-full max-w-full flex-row gap-4 overflow-x-hidden p-4">
        <div
          className={
            "flex h-fit w-[600px] flex-col gap-[20px] rounded-[12px] bg-white p-[24px]"
          }
        >
          {/* <div
            className={"w-[64px] h-[64px] rounded-full bg-light-black"}
          ></div> */}

          {walletDetail?.info ? (
            Object.entries(walletDetail?.info)
              .filter(([key]) => key !== "amount") // Exclude 'amount'
              .map(([key, value]) => (
                <div key={key} className="flex items-center gap-[24px]">
                  <div className="w-[115px]">
                    <p className="text-[12px] font-medium text-text-grey">
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
          {walletDetail &&
            walletDetail?.info?.status?.toLowerCase() !== "approved" && (
              <div className={"flex justify-between gap-[16px]"}>
                <button
                  className={
                    "w-full rounded-[12px] border-[1px] border-light-grey-50 bg-white px-[48px] py-[11px]"
                  }
                  onClick={toggleWithdrawalReject}
                >
                  <p className={"text-[16px] font-medium text-black"}>
                    Reject withdrawal
                  </p>
                </button>
                <button
                  className={
                    "w-full rounded-[12px] border-[1px] border-step-color bg-gradient-green px-[48px] py-[11px]"
                  }
                  onClick={toggleWithdrawalAction}
                >
                  <p className={"text-[16px] font-medium text-white"}>
                    Approve Withdrawal
                  </p>
                </button>
              </div>
            )}
        </div>

        {/* details */}
        <div
          className={
            "lg:w-2/3 flex h-[762px] w-full flex-col rounded-[12px] bg-white"
          }
        >
          <div className={"border-b-[1px] border-b-grey-20 p-[24px]"}>
            <p className={"text-[16px] font-semiBold"}>Wallet summary</p>
          </div>
          <div className={"px-[24px] pb-[12px] pt-[24px]"}>
            <div
              className={
                "flex h-[44px] w-fit cursor-pointer items-center gap-[8px] rounded-[12px] border-[1px] border-light-grey-50 bg-none px-[14px] py-[12px]"
              }
              onClick={toggleUpdateBalance}
            >
              <div className={"flex items-center justify-between"}>
                <p className={"text-[14px] font-medium"}>Update Balance</p>
              </div>
              <ChevronDown className={"w-[20px]"} />
            </div>
          </div>
          <div className={"px-[24px] pb-[24px]"}>
            <div
              className={
                "flex flex-col rounded-[12px] border-[2px] border-mid-grey p-[16px]"
              }
            >
              <div
                className={
                  "flex cursor-pointer justify-between border-b-[1px] border-b-grey-20 p-[16px]"
                }
              >
                <div className={"flex flex-col gap-[8px]"}>
                  <p className={"text-[14px] font-normal text-text-grey"}>
                    Total amount earned
                  </p>
                  <p className={"text-[18px] font-semiBold"}>
                    ₦{" "}
                    {formatNumberWithCommas(
                      walletDetail?.history[0]?.wallet?.balance || 0,
                    )}
                  </p>
                </div>
                <ChevronRight className={"cursor-pointer"} />
              </div>
              <div
                className={
                  "flex cursor-pointer justify-between border-b-[1px] border-b-grey-20 p-[16px]"
                }
              >
                <div className={"flex flex-col gap-[8px]"}>
                  <p className={"text-[14px] font-normal text-text-grey"}>
                    Referral earning
                  </p>
                  <p className={"text-[18px] font-semiBold"}>
                    {" "}
                    ₦ {formatNumberWithCommas(0)}
                  </p>
                </div>
                <ChevronRight className={"cursor-pointer"} />
              </div>
              <div className={"flex cursor-pointer justify-between p-[16px]"}>
                <div className={"flex flex-col gap-[8px]"}>
                  <p className={"text-[14px] font-normal text-text-grey"}>
                    Affiliate earning
                  </p>
                  <p className={"text-[18px] font-semiBold"}>
                    {" "}
                    ₦ {formatNumberWithCommas(0)}
                  </p>
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
        userDetails={walletDetail}
        balance={walletDetail?.history[0]?.wallet?.balance}
      />

      <PayoutHistory
        isOpen={isPayoutOpen}
        toggle={togglePayoutHistory}
        data={[]}
      />
      <ReferralHistory
        isOpen={isReferralOpen}
        toggle={toggleReferralHistory}
        data={[]}
      />
      <AffiliateHistory
        isOpen={isAffiliateOpen}
        toggle={toggleAffiliateHistory}
        data={[]}
      />
    </MainLayout>
  );
}

export default WalletManagementDetailsClient;
