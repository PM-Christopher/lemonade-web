"use client";
import React, { useState } from "react";
import { BackHeader } from "@/components/global/BackHeader";
import { ChevronRight } from "lucide-react";
import { Button } from "@lemonade/ui";
import RewardsHistorySideMenu from "@/components/settings/RewardsHistorySideMenu";
import TribeHistorySideMenu from "@/components/settings/TribeHistorySideMenu";

import { useSelector } from "react-redux";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import MainLayout from "@/components/layouts/MainLayout";
import { TransactionHistorySkeleton, WalletDetailSkeleton } from "@/components/Skeletons";
import dynamic from "next/dynamic";
import { RootState } from "@/redux/store";
import { useAppDispatch } from "@/redux/hook";
import { useBankAccountQuery, useWalletSettingsQuery } from "@/features/settings/queries";
import { useRequestPayoutMutation, useRedeemPointsMutation } from "@/features/settings/mutations";
import { errorMessage } from "@/lib/api-error";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { routes } from "@/lib/routes";

// Off the initial bundle — only needed once "Request payout" is clicked
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const RequestPayoutModal = dynamic(() => import("@/components/settings/Modal/RequestPayoutModal"), {
  ssr: false,
});

function WalletSettingsClient() {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const { data, isLoading: loading } = useWalletSettingsQuery({
    enabled: isLoggedIn,
  });
  const bankAccountQuery = useBankAccountQuery({ enabled: isLoggedIn });
  const hasBankAccount = Boolean(bankAccountQuery.data?.bank_account);
  const requestPayoutMutation = useRequestPayoutMutation();
  const redeemPointsMutation = useRedeemPointsMutation();
  const profileLoading = requestPayoutMutation.isPending;
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isTribeHistoryOpen, setIsTribeHistoryOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleRewardsMenu = () => {
    setIsRewardsOpen(!isRewardsOpen);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handlePayoutRequest = () => {
    if (hasBankAccount) {
      // No amount means "pay out everything available", the backend's default.
      requestPayoutMutation.mutate(
        {},
        {
          onSuccess: (result) => {
            dispatch(
              updateToastifyReducer({
                show: true,
                message: `Payout of ₦${formatNumberWithCommas(Number(result.amount) || 0)} requested. It will be paid into your saved bank account.`,
                type: "success",
              }),
            );
          },
          onError: (error) => {
            dispatch(
              updateToastifyReducer({
                show: true,
                message: errorMessage(error, "Something went wrong, please try again later"),
                type: "error",
              }),
            );
          },
        },
      );
    } else {
      toggleModal();
    }
  };

  const handleRedeemPoints = () => {
    redeemPointsMutation.mutate(
      // No points = "redeem everything available", matching how "Request pay out" treats an
      // omitted amount. A fresh key per click — not reused across retries — so a genuine
      // second redemption isn't mistaken for a replay of the first.
      { idempotency_key: crypto.randomUUID() },
      {
        onSuccess: (result) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: `Redeemed ${result.points_redeemed} points for ₦${formatNumberWithCommas(Number(result.amount) || 0)}`,
              type: "success",
            }),
          );
        },
        onError: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Something went wrong, please try again later",
              type: "error",
            }),
          );
        },
      },
    );
  };

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <RewardsHistorySideMenu toggleMenu={toggleRewardsMenu} isOpen={isRewardsOpen} />
        <TribeHistorySideMenu
          toggleMenu={() => setIsTribeHistoryOpen((open) => !open)}
          isOpen={isTribeHistoryOpen}
        />
        <BackHeader title="Wallet" href={routes.SETTINGS} />

        <section className="laptop:flex-row laptop:px-0 mt-4 flex flex-col justify-center gap-5 px-2.5">
          {loading ? (
            <WalletDetailSkeleton />
          ) : (
            <div className="laptop:w-145 flex w-full flex-col">
              <div className="flex flex-col rounded-xl bg-white p-4">
                <div className="border-b-mid-grey flex flex-col border-b p-4">
                  <p className="text-text-grey text-body-s font-normal">Total Amount Earned</p>
                  <p className="tracking-custom text-body-xl font-semibold">
                    ₦{formatNumberWithCommas(Number(data?.total_amount_earned) || 0)}
                  </p>
                </div>
                <div className="border-b-mid-grey flex items-center justify-between border-b p-4">
                  <div className="flex flex-col">
                    <p className="text-text-grey text-body-s font-normal">Points balance</p>
                    <p className="tracking-custom text-body-xl font-semibold">
                      {formatNumberWithCommas(data?.points_balance || 0)} pts
                    </p>
                  </div>
                  {(data?.points_balance ?? 0) > 0 && (
                    <Button
                      className="bg-light-tint text-meta h-9 rounded-xl px-4 leading-normal font-semibold"
                      onClick={handleRedeemPoints}
                      disabled={redeemPointsMutation.isPending}
                    >
                      {redeemPointsMutation.isPending ? "Redeeming..." : "Redeem"}
                    </Button>
                  )}
                </div>
                <div className="border-b-mid-grey flex justify-between border-b p-4">
                  <div className="flex flex-col">
                    <p className="text-text-grey text-body-s font-normal">Rewards earned</p>
                    <p className="tracking-custom text-body-xl font-semibold">
                      ₦{formatNumberWithCommas(Number(data?.rewards_earned) || 0)}
                    </p>
                  </div>
                  <ChevronRight onClick={toggleRewardsMenu} className="cursor-pointer" />
                </div>
                <div className="flex justify-between p-4">
                  <div className="flex flex-col">
                    <p className="text-text-grey text-body-s font-normal">Monetized Tribes</p>
                    <p className="tracking-custom text-body-xl font-semibold">
                      ₦{formatNumberWithCommas(Number(data?.monetized_tribes) || 0)}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="View tribe history"
                    className="cursor-pointer"
                    onClick={() => setIsTribeHistoryOpen(true)}
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
              {data?.payout_request && (
                <div className="bg-light-tint mt-6 flex flex-col rounded-xl p-4">
                  <p className="text-light-black text-body-l font-normal">
                    Commission payouts are available when you&apos;ve earned over ₦100,000
                  </p>
                  <Button
                    className={`bg-gradient-green mt-4 h-12 w-fit rounded-xl p-3.5 px-12 ${
                      !profileLoading
                        ? "border-step-color bg-gradient-green border"
                        : "bg-mid-green cursor-not-allowed opacity-70"
                    } `}
                    onClick={handlePayoutRequest}
                    disabled={profileLoading || !bankAccountQuery.isSuccess}
                  >
                    {profileLoading ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        <p className={"font-semi-normal text-body-l"}>Loading...</p>
                      </>
                    ) : (
                      <p className={"font-semi-normal text-body-l"}>Request pay out</p>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
          <div>
            <div className="laptop:w-171 flex w-full flex-col rounded-xl bg-white">
              <div className="border-b p-4">
                <p className="text-body-l font-semibold">Payout history</p>
              </div>
              {loading ? (
                <TransactionHistorySkeleton count={4} />
              ) : (
                <div className="px-6">
                  {data?.payout_history?.map((history, index: number) => (
                    <div className="flex items-center justify-between pt-4 pb-6" key={index}>
                      <div className="flex flex-col">
                        <p className="font-semi-normal text-body-s">
                          ₦{formatNumberWithCommas(Number(history?.amount) || 0)}
                        </p>
                        <p className="text-text-grey text-meta leading-normal font-normal">
                          {history?.date}
                        </p>
                      </div>
                      {history?.status === "processing" && (
                        <div className="bg-warning rounded-lg px-2 py-1">
                          <p className="font-semi-normal text-warning-bold text-meta leading-normal">
                            Processing
                          </p>
                        </div>
                      )}
                      {history?.status === "completed" ||
                        (history?.status === "successful" && (
                          <div className="bg-light-green-60 rounded-lg px-2 py-1">
                            <p className="font-semi-normal text-light-green-70 text-meta leading-normal">
                              Completed
                            </p>
                          </div>
                        ))}
                      {history?.status === "failed" && (
                        <div className="bg-red-3 rounded-lg px-2 py-1">
                          <p className="font-semi-normal text-red-1 text-meta leading-normal">
                            Failed
                          </p>
                        </div>
                      )}
                      {history?.status === "pending" && (
                        <div className="bg-warning rounded-lg px-2 py-1">
                          <p className="font-semi-normal text-warning-bold text-meta leading-normal">
                            Pending
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  {/*<div className="pt-4 pb-6 flex justify-between items-center">*/}
                  {/*    <div className="flex flex-col">*/}
                  {/*        <p className="font-semi-normal text-body-s">N2,000</p>*/}
                  {/*        <p className="font-normal text-meta leading-normal text-text-grey">23 Mar, 2023 05:00PM</p>*/}
                  {/*    </div>*/}

                  {/*</div>*/}
                  {/*<div className="pt-4 pb-6 flex justify-between items-center">*/}
                  {/*    <div className="flex flex-col">*/}
                  {/*        <p className="font-semi-normal text-body-s">N2,000</p>*/}
                  {/*        <p className="font-normal text-meta leading-normal text-text-grey">23 Mar, 2023 05:00PM</p>*/}
                  {/*    </div>*/}

                  {/*</div>*/}
                </div>
              )}
            </div>
          </div>
        </section>
        <RequestPayoutModal isOpen={isOpen} toggle={toggleModal} />
      </section>
    </MainLayout>
  );
}

export default WalletSettingsClient;
