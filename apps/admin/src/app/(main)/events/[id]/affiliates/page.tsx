import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { CalendarIcon, CopyIcon, DotIcon, MapPinIcon } from "lucide-react";

const AffiliateDetailsPage = ({}) => {
  return (
    <MainLayout>
      <section className={"flex justify-between gap-0.5 p-5"}>
        <div className={"flex h-fit w-[400px] flex-col gap-3 rounded-xl bg-white p-6"}>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Affiliate Name:</p>
            </div>
            <div className={"flex gap-1"}>
              <p className={"text-[14px] font-medium"}>Adebayo Akintoye</p>
            </div>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Affiliate ID:</p>
            </div>
            <p className={"text-[14px] font-medium"}>AF112332</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Date Joined:</p>
            </div>
            <div className={"flex gap-1"}>
              <p className={"text-[14px] font-medium"}>24 Apr, 2024 09:45 PM</p>
            </div>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>No of Programs:</p>
            </div>
            <p className={"text-light-green-70 text-[14px] font-medium"}>Completed</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Total Tickets Sold:</p>
            </div>
            <p className={"text-[14px] font-medium"}>4</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Total Revenue:</p>
            </div>
            <p className={"text-[14px] font-medium"}>N30,000</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Account Number:</p>
            </div>
            <p className={"text-[14px] font-medium"}>0923432934</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Account Holder:</p>
            </div>
            <p className={"text-[14px] font-medium"}>Funmilayo Johnson</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Bank Name:</p>
            </div>
            <p className={"text-[14px] font-medium"}>GTB</p>
          </div>
          <p className={"text-light-green text-[14px] font-medium"}>View transaction history</p>
        </div>
        <div className={"flex h-fit w-[780px] flex-col gap-4 rounded-xl bg-white"}>
          <div className={"border-b p-6"}>
            <p className={"font-semiBold text-[16px]"}>Programs</p>
          </div>
          <div className={"flex flex-col p-6"}>
            <div className={"bg-light-grey flex flex-col gap-2 rounded-xl p-2"}>
              <div className={"bg-green-tint flex items-center gap-3 p-2 px-4"}>
                <div className={"h-24 w-24 rounded-[8px] bg-gray-600"}></div>
                <div className={"flex flex-col gap-1"}>
                  <p className={"font-semiBold text-[18px]"}>Halloween party</p>
                  <div className={"flex items-center gap-1"}>
                    <CalendarIcon className={"text-text-grey w-3.5"} />
                    <p className={"text-text-grey text-[16px] font-normal"}>Mon, 23 Mar</p>
                    <DotIcon className={"text-text-grey w-3"} />
                    <p className={"text-text-grey text-[16px] font-normal"}>4PM - 6PM</p>
                  </div>
                  <div className={"flex items-center gap-1"}>
                    <MapPinIcon className={"text-text-grey w-3.5"} />
                    <p className={"text-text-grey text-[16px] font-normal"}>Lekki phase 1</p>
                  </div>
                </div>
              </div>
              <div className={"bg-grey-20 flex items-center justify-between gap-2 rounded-xl p-2"}>
                <p className={"text-text-grey text-[12px] font-medium"}>
                  Affiliate link:{" "}
                  <span className={"text-light-black font-medium"}>
                    https://www.lemonade.com/event_channel/referral_ID
                  </span>
                </p>
                <div className={"flex items-center gap-1"}>
                  <p className={"text-grey-30"}>|</p>
                  <CopyIcon className={"text-grey-40 w-3.5"} />
                </div>
              </div>
              <div className={"items-center-center flex gap-6"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Total Commission:</p>
                </div>
                <p className={"text-[14px] font-medium"}>N300,000</p>
              </div>
              <div className={"items-center-center flex gap-6"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Total Tickets Sold:</p>
                </div>
                <p className={"text-[14px] font-medium"}>300</p>
              </div>
              <div className={"flex justify-between gap-1"}>
                <div
                  className={
                    "border-grey-20 flex h-[103px] w-full flex-col gap-2 rounded-[8px] border bg-white p-3"
                  }
                >
                  <p className={"font-semiBold text-[14px]"}>Free Tickets</p>
                  <div className={"items-center-center flex gap-6"}>
                    <div className={"w-[115px]"}>
                      <p className={"text-text-grey text-[12px] font-medium"}>Sold:</p>
                    </div>
                    <p className={"text-[14px] font-medium"}>30</p>
                  </div>
                  <div className={"items-center-center flex gap-6"}>
                    <div className={"w-[115px]"}>
                      <p className={"text-text-grey text-[12px] font-medium"}>Commission:</p>
                    </div>
                    <p className={"text-[14px] font-medium"}>N2,000</p>
                  </div>
                </div>
                <div
                  className={
                    "border-grey-20 flex h-[103px] w-full flex-col gap-2 rounded-[8px] border bg-white p-3"
                  }
                >
                  <p className={"font-semiBold text-[14px]"}>Free Tickets</p>
                  <div className={"items-center-center flex gap-6"}>
                    <div className={"w-[115px]"}>
                      <p className={"text-text-grey text-[12px] font-medium"}>Sold:</p>
                    </div>
                    <p className={"text-[14px] font-medium"}>30</p>
                  </div>
                  <div className={"items-center-center flex gap-6"}>
                    <div className={"w-[115px]"}>
                      <p className={"text-text-grey text-[12px] font-medium"}>Commission:</p>
                    </div>
                    <p className={"text-[14px] font-medium"}>N2,000</p>
                  </div>
                </div>
                <div
                  className={
                    "border-grey-20 flex h-[103px] w-full flex-col gap-2 rounded-[8px] border bg-white p-3"
                  }
                >
                  <p className={"font-semiBold text-[14px]"}>Free Tickets</p>
                  <div className={"items-center-center flex gap-6"}>
                    <div className={"w-[115px]"}>
                      <p className={"text-text-grey text-[12px] font-medium"}>Sold:</p>
                    </div>
                    <p className={"text-[14px] font-medium"}>30</p>
                  </div>
                  <div className={"items-center-center flex gap-6"}>
                    <div className={"w-[115px]"}>
                      <p className={"text-text-grey text-[12px] font-medium"}>Commission:</p>
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
