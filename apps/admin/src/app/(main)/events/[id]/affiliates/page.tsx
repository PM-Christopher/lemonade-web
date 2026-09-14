import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { CalendarIcon, CopyIcon, DotIcon, MapPinIcon } from "lucide-react";

const AffiliateDetailsPage = ({}) => {
  return (
    <MainLayout>
      <section className={"flex justify-between gap-[2px] p-[20px]"}>
        <div
          className={"flex h-fit w-[400px] flex-col gap-[12px] rounded-[12px] bg-white p-[24px]"}
        >
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>Affiliate Name:</p>
            </div>
            <div className={"flex gap-[4px]"}>
              <p className={"text-[14px] font-medium"}>Adebayo Akintoye</p>
            </div>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>Affiliate ID:</p>
            </div>
            <p className={"text-[14px] font-medium"}>AF112332</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>Date Joined:</p>
            </div>
            <div className={"flex gap-[4px]"}>
              <p className={"text-[14px] font-medium"}>24 Apr, 2024 09:45 PM</p>
            </div>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>No of Programs:</p>
            </div>
            <p className={"text-[14px] font-medium text-light-green-70"}>Completed</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>Total Tickets Sold:</p>
            </div>
            <p className={"text-[14px] font-medium"}>4</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>Total Revenue:</p>
            </div>
            <p className={"text-[14px] font-medium"}>N30,000</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>Account Number:</p>
            </div>
            <p className={"text-[14px] font-medium"}>0923432934</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>Account Holder:</p>
            </div>
            <p className={"text-[14px] font-medium"}>Funmilayo Johnson</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>Bank Name:</p>
            </div>
            <p className={"text-[14px] font-medium"}>GTB</p>
          </div>
          <p className={"text-[14px] font-medium text-light-green"}>View transaction history</p>
        </div>
        <div className={"flex h-fit w-[780px] flex-col gap-[16px] rounded-[12px] bg-white"}>
          <div className={"border-b-[1px] p-[24px]"}>
            <p className={"text-[16px] font-semiBold"}>Programs</p>
          </div>
          <div className={"flex flex-col p-[24px]"}>
            <div className={"flex flex-col gap-[8px] rounded-[12px] bg-light-grey p-[8px]"}>
              <div className={"flex items-center gap-[12px] bg-green-tint p-[8px] px-[16px]"}>
                <div className={"h-[96px] w-[96px] rounded-[8px] bg-gray-600"}></div>
                <div className={"flex flex-col gap-[4px]"}>
                  <p className={"text-[18px] font-semiBold"}>Halloween party</p>
                  <div className={"flex items-center gap-[4px]"}>
                    <CalendarIcon className={"w-[14px] text-text-grey"} />
                    <p className={"text-[16px] font-normal text-text-grey"}>Mon, 23 Mar</p>
                    <DotIcon className={"w-[12px] text-text-grey"} />
                    <p className={"text-[16px] font-normal text-text-grey"}>4PM - 6PM</p>
                  </div>
                  <div className={"flex items-center gap-[4px]"}>
                    <MapPinIcon className={"w-[14px] text-text-grey"} />
                    <p className={"text-[16px] font-normal text-text-grey"}>Lekki phase 1</p>
                  </div>
                </div>
              </div>
              <div
                className={
                  "flex items-center justify-between gap-[8px] rounded-[12px] bg-grey-20 p-[8px]"
                }
              >
                <p className={"text-[12px] font-medium text-text-grey"}>
                  Affiliate link:{" "}
                  <span className={"font-medium text-light-black"}>
                    https://www.lemonade.com/event_channel/referral_ID
                  </span>
                </p>
                <div className={"flex items-center gap-[4px]"}>
                  <p className={"text-grey-30"}>|</p>
                  <CopyIcon className={"w-[14px] text-grey-40"} />
                </div>
              </div>
              <div className={"items-center-center flex gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-[12px] font-medium text-text-grey"}>Total Commission:</p>
                </div>
                <p className={"text-[14px] font-medium"}>N300,000</p>
              </div>
              <div className={"items-center-center flex gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-[12px] font-medium text-text-grey"}>Total Tickets Sold:</p>
                </div>
                <p className={"text-[14px] font-medium"}>300</p>
              </div>
              <div className={"flex justify-between gap-[4px]"}>
                <div
                  className={
                    "flex h-[103px] w-full flex-col gap-[8px] rounded-[8px] border-[1px] border-grey-20 bg-white p-[12px]"
                  }
                >
                  <p className={"text-[14px] font-semiBold"}>Free Tickets</p>
                  <div className={"items-center-center flex gap-[24px]"}>
                    <div className={"w-[115px]"}>
                      <p className={"text-[12px] font-medium text-text-grey"}>Sold:</p>
                    </div>
                    <p className={"text-[14px] font-medium"}>30</p>
                  </div>
                  <div className={"items-center-center flex gap-[24px]"}>
                    <div className={"w-[115px]"}>
                      <p className={"text-[12px] font-medium text-text-grey"}>Commission:</p>
                    </div>
                    <p className={"text-[14px] font-medium"}>N2,000</p>
                  </div>
                </div>
                <div
                  className={
                    "flex h-[103px] w-full flex-col gap-[8px] rounded-[8px] border-[1px] border-grey-20 bg-white p-[12px]"
                  }
                >
                  <p className={"text-[14px] font-semiBold"}>Free Tickets</p>
                  <div className={"items-center-center flex gap-[24px]"}>
                    <div className={"w-[115px]"}>
                      <p className={"text-[12px] font-medium text-text-grey"}>Sold:</p>
                    </div>
                    <p className={"text-[14px] font-medium"}>30</p>
                  </div>
                  <div className={"items-center-center flex gap-[24px]"}>
                    <div className={"w-[115px]"}>
                      <p className={"text-[12px] font-medium text-text-grey"}>Commission:</p>
                    </div>
                    <p className={"text-[14px] font-medium"}>N2,000</p>
                  </div>
                </div>
                <div
                  className={
                    "flex h-[103px] w-full flex-col gap-[8px] rounded-[8px] border-[1px] border-grey-20 bg-white p-[12px]"
                  }
                >
                  <p className={"text-[14px] font-semiBold"}>Free Tickets</p>
                  <div className={"items-center-center flex gap-[24px]"}>
                    <div className={"w-[115px]"}>
                      <p className={"text-[12px] font-medium text-text-grey"}>Sold:</p>
                    </div>
                    <p className={"text-[14px] font-medium"}>30</p>
                  </div>
                  <div className={"items-center-center flex gap-[24px]"}>
                    <div className={"w-[115px]"}>
                      <p className={"text-[12px] font-medium text-text-grey"}>Commission:</p>
                    </div>
                    <p className={"text-[14px] font-medium"}>N2,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AffiliateDetailsPage;
