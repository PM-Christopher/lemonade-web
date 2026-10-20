"use client";
import MainLayout from "@/components/layouts/MainLayout";
import { useAffiliateDetailQuery } from "@/features/user/queries";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import ReferralHistory from "@/modals/wallet-management/ReferralHistory";
import { RootState } from "@/redux/store";
import { ChevronRight, CopyIcon } from "lucide-react";
import { clientEnv } from "@/lib/env.client";
import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const AffiliateUserClient = ({ id }: { id: string }) => {
  const [refHistoryOpen, setRefHistoryOpen] = useState<boolean>(false);

  const toggleHistoryOpen = () => {
    setRefHistoryOpen(!refHistoryOpen);
  };

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: isData } = useAffiliateDetailQuery(id, { enabled: isLoggedIn });

  // The user app's signup page prefills the code; needs the user app's address to build.
  const referralCode = isData?.detail?.referral_code;
  const userAppUrl = clientEnv.NEXT_PUBLIC_USER_APP_URL;
  const referralLink =
    referralCode && userAppUrl
      ? `${userAppUrl.replace(/\/$/, "")}/signup?referral=${encodeURIComponent(referralCode)}`
      : null;

  return (
    <MainLayout>
      <section className="flex w-full max-w-full flex-col gap-4 overflow-x-hidden p-4 md:gap-5 md:p-5 lg:flex-row lg:items-start">
        <div
          className={"flex h-fit w-full shrink-0 flex-col gap-5 rounded-xl bg-white p-6 lg:w-150"}
        >
          <div className={"flex justify-between"}>
            {/* <div
              className={"w-16 h-16 bg-light-black rounded-full"}
            ></div> */}

            {isData?.detail?.image ? (
              <Image
                src={isData?.detail?.image}
                alt="image"
                width={89}
                height={83}
                className={"bg-light-black h-16 w-16 rounded-full"}
              />
            ) : (
              // null
              <div className={"bg-light-black h-16 w-16 rounded-full"}></div>
            )}
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>Full name:</p>
            </div>
            <div className={"flex gap-1"}>
              <p className={"text-body-s font-medium"}>{isData?.detail?.name}</p>
            </div>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>User ID:</p>
            </div>
            <p className={"text-body-s font-medium"}> {isData?.detail?.unique_id}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>Status:</p>
            </div>
            <p className={"text-light-green-70 text-body-s font-medium"}>
              {isData?.detail?.status}
            </p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>
                Referral Code:
              </p>
            </div>
            <div className={"flex gap-1"}>
              <p className={"text-body-s font-medium"}> {isData?.detail?.referral_code}</p>
              {isData?.detail?.referral_code && (
                <button
                  type="button"
                  aria-label="Copy referral code"
                  className="text-light-green cursor-pointer"
                  onClick={() => void navigator.clipboard?.writeText(isData.detail.referral_code)}
                >
                  <CopyIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          {referralLink && (
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-28.75"}>
                <p className={"text-text-grey text-meta leading-normal font-medium"}>
                  Referral Link:
                </p>
              </div>
              <div className={"flex min-w-0 gap-1"}>
                <p className={"text-body-s truncate font-medium"}>{referralLink}</p>
                <button
                  type="button"
                  aria-label="Copy referral link"
                  className="text-light-green cursor-pointer"
                  onClick={() => void navigator.clipboard?.writeText(referralLink)}
                >
                  <CopyIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col">
          <div className={"flex h-175 flex-col rounded-tl-xl rounded-tr-xl bg-white"}>
            <div className="border-b-grey-20 mt-2.5 flex h-10 justify-between border-b px-4 py-2">
              <p className="text-body-l font-semibold">Referral activity</p>
            </div>

            <div className="flex flex-col">
              <div className={"flex flex-col gap-2 p-6"}>
                <div className={"border-mid-grey flex flex-col rounded-xl border p-4"}>
                  <div
                    className={"border-b-grey-20 flex cursor-pointer justify-between border-b p-4"}
                  >
                    <div className={"flex flex-col gap-2"}>
                      <p className={"text-text-grey text-body-s font-normal"}>
                        Total Amount Earned
                      </p>
                      <p className={"font-semiBold text-black-light text-body-xl"}>
                        ₦ {formatNumberWithCommas(isData?.total_amount_earned || 0)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={"border-b-grey-20 flex cursor-pointer justify-between border-b p-4"}
                  >
                    <div className={"flex flex-col gap-2"}>
                      <p className={"text-text-grey text-body-s font-normal"}>Total Referrals</p>
                      <p className={"font-semiBold text-black-light text-body-xl"}>
                        {formatNumberWithCommas(isData?.total_referrals || 0)}
                      </p>
                    </div>
                  </div>
                  <div className={"flex cursor-pointer justify-between p-4"}>
                    <div className={"flex flex-col gap-2"}>
                      <p className={"text-text-grey text-body-s font-normal"}>
                        Total Subscribed Referrals
                      </p>
                      <p className={"font-semiBold text-black-light text-body-xl"}>
                        {" "}
                        {formatNumberWithCommas(isData?.total_subscribed_referrals || 0)}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="flex cursor-pointer items-center gap-2 p-3 px-4"
                  onClick={toggleHistoryOpen}
                >
                  <p className="text-light-green text-body-l font-medium">View history</p>
                  <ChevronRight className="text-light-green" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ReferralHistory toggle={toggleHistoryOpen} isOpen={refHistoryOpen} affiliateId={id} />
    </MainLayout>
  );
};

export default AffiliateUserClient;
