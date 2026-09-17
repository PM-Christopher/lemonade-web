"use client";
import MainLayout from "@/components/layouts/MainLayout";
import { useAffiliateDetailQuery } from "@/features/user/queries";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import ReferralHistory from "@/modals/wallet-management/ReferralHistory";
import { RootState } from "@/redux/store";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const AffiliateUserClient = ({ id }: { id: number | undefined }) => {
  const [refHistoryOpen, setRefHistoryOpen] = useState<boolean>(false);

  const toggleHistoryOpen = () => {
    setRefHistoryOpen(!refHistoryOpen);
  };

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: isData } = useAffiliateDetailQuery(id, { enabled: isLoggedIn });

  return (
    <MainLayout>
      <section className="md:p-5 lg:flex-col md:gap-5 flex w-full max-w-full flex-row gap-4 overflow-x-hidden p-4">
        <div
          className={
            "flex h-fit w-[600px] flex-col gap-[20px] rounded-[12px] bg-white p-[24px]"
          }
        >
          <div className={"flex justify-between"}>
            {/* <div
              className={"w-[64px] h-[64px] bg-light-black rounded-full"}
            ></div> */}

            {isData?.detail?.image ? (
              <Image
                src={isData?.detail?.image}
                alt="image"
                width={89}
                height={83}
                className={"h-[64px] w-[64px] rounded-full bg-light-black"}
              />
            ) : (
              // null
              <div
                className={"h-[64px] w-[64px] rounded-full bg-light-black"}
              ></div>
            )}
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Full name:
              </p>
            </div>
            <div className={"flex gap-[4px]"}>
              <p className={"text-[14px] font-medium"}>
                {isData?.detail?.name}
              </p>
            </div>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                User ID:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>
              {" "}
              {isData?.detail?.unique_id}
            </p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Status:
              </p>
            </div>
            <p className={"text-[14px] font-medium text-light-green-70"}>
              {isData?.detail?.status}
            </p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Referral Code:
              </p>
            </div>
            <div className={"flex gap-[4px]"}>
              <p className={"text-[14px] font-medium"}>
                {" "}
                {isData?.detail?.referral_code}
              </p>
              {/* <p
                className={
                  "cursor-pointer font-medium text-[14px] text-light-green"
                }
              >
                copy icon
              </p> */}
            </div>
          </div>
          {/* <div className={"flex gap-[24px] items-center-center"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>
                Referral Link:
              </p>
            </div>
            <div className={"flex gap-[4px]"}>
              <p className={"text-[14px] font-medium"}>
                https://app.lemonade.com/ref=?adeba123
              </p>
            </div>
            <p
              className={
                "cursor-pointer font-medium text-[14px] text-light-green"
              }
            >
              copy icon
            </p>
          </div> */}
        </div>

        <div className="lg:w-2/3 flex w-full flex-col">
          <div
            className={
              "flex h-[700px] flex-col rounded-tl-[12px] rounded-tr-[12px] bg-white"
            }
          >
            <div className="mt-[10px] flex h-10 justify-between border-b-[1px] border-b-grey-20 px-[16px] py-[8px]">
              <p className="text-[16px] font-semibold">Referral activity</p>
            </div>

            <div className="flex flex-col">
              <div className={"flex flex-col gap-[8px] p-[24px]"}>
                <div
                  className={
                    "flex flex-col rounded-[12px] border-[1px] border-mid-grey p-[16px]"
                  }
                >
                  <div
                    className={
                      "flex cursor-pointer justify-between border-b-[1px] border-b-grey-20 p-[16px]"
                    }
                  >
                    <div className={"flex flex-col gap-[8px]"}>
                      <p className={"text-[14px] font-normal text-text-grey"}>
                        Total Amount Earned
                      </p>
                      <p
                        className={"text-[18px] font-semiBold text-black-light"}
                      >
                        ₦{" "}
                        {formatNumberWithCommas(
                          isData?.total_amount_earned || 0,
                        )}
                      </p>
                    </div>
                    <ChevronRight className={"text-text-grey"} />
                  </div>
                  <div
                    className={
                      "flex cursor-pointer justify-between border-b-[1px] border-b-grey-20 p-[16px]"
                    }
                  >
                    <div className={"flex flex-col gap-[8px]"}>
                      <p className={"text-[14px] font-normal text-text-grey"}>
                        Total Referrals
                      </p>
                      <p
                        className={"text-[18px] font-semiBold text-black-light"}
                      >
                        {formatNumberWithCommas(isData?.total_referrals || 0)}
                      </p>
                    </div>
                    <ChevronRight className={"text-text-grey"} />
                  </div>
                  <div
                    className={"flex cursor-pointer justify-between p-[16px]"}
                  >
                    <div className={"flex flex-col gap-[8px]"}>
                      <p className={"text-[14px] font-normal text-text-grey"}>
                        Total Subscribed Referrals
                      </p>
                      <p
                        className={"text-[18px] font-semiBold text-black-light"}
                      >
                        {" "}
                        {formatNumberWithCommas(
                          isData?.total_subscribed_referrals || 0,
                        )}
                      </p>
                    </div>
                    <ChevronRight className={"text-text-grey"} />
                  </div>
                </div>
                <div
                  className="flex cursor-pointer items-center gap-[8px] p-[12px] px-[16px]"
                  onClick={toggleHistoryOpen}
                >
                  <p className="text-[16px] font-medium text-light-green">
                    View history
                  </p>
                  <ChevronRight className="text-light-green" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ReferralHistory
        toggle={toggleHistoryOpen}
        isOpen={refHistoryOpen}
        data={[]}
      />
    </MainLayout>
  );
};

export default AffiliateUserClient;
