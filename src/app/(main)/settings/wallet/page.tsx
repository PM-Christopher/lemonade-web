"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReferralSideMenu from "@/components/settings/ReferralSideMenu";
import AffiliateSideMenu from "@/components/settings/AffiliateSideMenu";
import BankAccountModal from "@/components/settings/Modal/BankAccountModal";
import PayoutModal from "@/components/settings/Modal/PayoutModal";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useRequest } from "@/hooks/useRequest";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import MainLayout from "@/components/layouts/MainLayout";

function WalletSettingsPage({}) {
  const router = useRouter();
  const { authToken } = useSelector((state: any) => state.auth);
  const getHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  };

  const { data, loading } = useRequest(
    `profile/wallet`,
    "GET",
    {},
    true,
    getHeader()
  );
  const [isRefOpen, setIsRefOpen] = useState(false);
  const [isAfOpen, setIsAfOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPOpen, setIsPOpen] = useState(false);

  const toggleRefMenu = () => {
    setIsRefOpen(!isRefOpen);
  };

  const toggleAfMenu = () => {
    setIsAfOpen(!isAfOpen);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const togglePModal = () => {
    setIsPOpen(!isPOpen);
  };

  console.log({ data });

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <ReferralSideMenu toggleMenu={toggleRefMenu} isOpen={isRefOpen} />
        <AffiliateSideMenu isOpen={isAfOpen} toggleMenu={toggleAfMenu} />
        <div className="bg-white flex justify-between p-[8px] px-[16px] laptop:px-[64px] border-t-[1px] border-b-[1px] items-center">
          <div
            className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
            onClick={() => router.push("/settings")}
          >
            <ChevronLeft />
            <p className="font-sans font-semibold text-[16px] tracking-custom">
              Account settings
            </p>
          </div>
        </div>

        <section className="mt-4 flex flex-col laptop:flex-row justify-center gap-[20px] px-[10px] laptop:px-0">
          <div className="flex flex-col w-full laptop:w-[580px]">
            <div className="rounded-[12px] p-[16px] flex flex-col bg-white">
              <div className="flex flex-col p-[16px] border-b-[1px] border-b-mid-grey">
                <p className="font-normal text-[14px] text-text-grey">
                  Total Amount Earned
                </p>
                <p className="font-semibold text-[18px] tracking-custom">
                  N{formatNumberWithCommas(data?.total_amount_earned)}
                </p>
              </div>
              <div className="flex justify-between p-[16px] border-b-[1px] border-b-mid-grey">
                <div className="flex flex-col">
                  <p className="font-normal text-[14px] text-text-grey">
                    Referral earnings
                  </p>
                  <p className="font-semibold text-[18px] tracking-custom">
                    N{formatNumberWithCommas(data?.referral_earnings)}
                  </p>
                </div>
                <ChevronRight
                  onClick={toggleRefMenu}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex justify-between p-[16px]">
                <div className="flex flex-col">
                  <p className="font-normal text-[14px] text-text-grey">
                    Affiliate earnings
                  </p>
                  <p className="font-semibold text-[18px] tracking-custom">
                    N{formatNumberWithCommas(data?.affiliate_earnings)}
                  </p>
                </div>
                <ChevronRight
                  onClick={toggleAfMenu}
                  className="cursor-pointer"
                />
              </div>
            </div>
            {data?.payout_request && (
              <div className="rounded-[12px] p-[16px] flex flex-col bg-light-tint mt-[24px]">
                <p className="font-normal text-[16px] text-light-black">
                  Commission payouts are available when you've earned over
                  ₦100,000
                </p>
                <Button
                  className="bg-gradient-green h-[48px] rounded-[12px] w-fit p-[14px] px-[48px] mt-[16px]"
                  onClick={toggleModal}
                >
                  <p className="font-semi-normal text-[16px]">
                    Request pay out
                  </p>
                </Button>
              </div>
            )}
          </div>
          <div>
            <div className="w-full laptop:min-w-[684px] rounded-[12px] flex flex-col bg-white">
              <div className="border-b-[1px] p-[16px]">
                <p className="font-semibold text-[16px]">Payout history</p>
              </div>
              <div className="px-[24px]">
                {data?.payout_history?.map((history: any, index: number) => (
                  <div
                    className="pt-[16px] pb-[24px] flex justify-between items-center"
                    key={index}
                  >
                    <div className="flex flex-col">
                      <p className="font-semi-normal text-[14px]">
                        N{formatNumberWithCommas(history?.amount)}
                      </p>
                      <p className="font-normal text-[12px] text-text-grey">
                        {history?.date}
                      </p>
                    </div>
                    {history?.status === "processing" && (
                      <div className="bg-warning py-[4px] px-[8px] rounded-[8px]">
                        <p className="font-semi-normal text-[12px] text-warning-bold">
                          Processing
                        </p>
                      </div>
                    )}
                    {history?.status === "completed" && (
                      <div className="bg-light-green-60 py-[4px] px-[8px] rounded-[8px]">
                        <p className="font-semi-normal text-[12px] text-light-green-70">
                          Completed
                        </p>
                      </div>
                    )}
                    {history?.status === "failed" && (
                      <div className="bg-red-3 py-[4px] px-[8px] rounded-[8px]">
                        <p className="font-semi-normal text-[12px] text-red-1">
                          Failed
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                {/*<div className="pt-[16px] pb-[24px] flex justify-between items-center">*/}
                {/*    <div className="flex flex-col">*/}
                {/*        <p className="font-semi-normal text-[14px]">N2,000</p>*/}
                {/*        <p className="font-normal text-[12px] text-text-grey">23 Mar, 2023 05:00PM</p>*/}
                {/*    </div>*/}

                {/*</div>*/}
                {/*<div className="pt-[16px] pb-[24px] flex justify-between items-center">*/}
                {/*    <div className="flex flex-col">*/}
                {/*        <p className="font-semi-normal text-[14px]">N2,000</p>*/}
                {/*        <p className="font-normal text-[12px] text-text-grey">23 Mar, 2023 05:00PM</p>*/}
                {/*    </div>*/}

                {/*</div>*/}
              </div>
            </div>
          </div>
        </section>
        <BankAccountModal isOpen={isOpen} toggle={toggleModal} />
        <PayoutModal isOpen={isPOpen} toggle={togglePModal} />
      </section>
    </MainLayout>
  );
}

export default WalletSettingsPage;
