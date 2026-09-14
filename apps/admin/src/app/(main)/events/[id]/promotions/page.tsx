import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { CalendarIcon, ChevronDown, ChevronRight, ClockIcon, MapPinIcon } from "lucide-react";

const PromotionDetailsPage = ({}) => {
  return (
    <MainLayout>
      <section className={"flex justify-between p-[20px]"}>
        <div className={"flex h-fit w-[588px] flex-col gap-[12px] rounded-[12px] bg-white"}>
          <div className={"flex items-center justify-between border-b-[1px] p-[24px]"}>
            <p className={"text-[16px] font-semiBold"}>Event summary</p>
          </div>
          <div className={"flex flex-col gap-[20px] p-[24px]"}>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Event Name:</p>
              </div>
              <p className={"text-[14px] font-medium"}>Unlocking business potentials</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Event Owner:</p>
              </div>
              <div className={"flex gap-[4px]"}>
                <p className={"text-[14px] font-medium"}>Adebayo Akintoye</p>
                <p className={"text-[14px] font-medium text-light-green"}>Open chat</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Event ID:</p>
              </div>
              <p className={"text-[14px] font-medium"}>PR112332</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Promotion Name:</p>
              </div>
              <p className={"text-[14px] font-medium"}>Instagram Feed Post</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Amount:</p>
              </div>
              <div className={"flex gap-[4px]"}>
                <p className={"text-[14px] font-medium"}>N30,000</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Date Paid:</p>
              </div>
              <p className={"text-[14px] font-medium"}>23 Apr, 2024 09:45 PM</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Promotion Date:</p>
              </div>
              <p className={"text-[14px] font-medium"}>N/A</p>
            </div>
            <div className={"items-center-center flex gap-[24px]"}>
              <div className={"w-[115px]"}>
                <p className={"text-[12px] font-medium text-text-grey"}>Promotion Status:</p>
              </div>
              <p className={"text-[14px] font-medium text-warning-bold"}>Pending</p>
            </div>
            <div className={"items-center-center mt-[40px] flex justify-between gap-[24px]"}>
              <button
                className={
                  "w-[299px] rounded-[12px] border-[2px] border-light-grey-50 px-[48px] py-[11px]"
                }
                type={"button"}
              >
                Mark as completed
              </button>
              <button
                className={
                  "w-[299px] rounded-[12px] border-[1px] border-step-color bg-gradient-green px-[48px] py-[11px] text-[16px] font-medium text-white"
                }
                type={"button"}
              >
                Schedule
              </button>
            </div>
          </div>
        </div>

        <div
          className={
            "flex h-fit w-[880px] flex-col gap-[16px] rounded-tl-[12px] rounded-tr-[12px] bg-white p-[24px]"
          }
        >
          <div className={"h-[343px] w-[320px] rounded-[16px] bg-gray-600"}></div>
          <p className={"text-[20px] font-semiBold"}>Unlocking business potentials</p>
          <div className={"flex flex-col gap-[8px]"}>
            <div className={"flex items-center gap-[8px]"}>
              <CalendarIcon className={"text-text-grey"} />
              <p className={"text-[14px] font-medium text-text-grey"}>Mon, 23 Mar - Mon 23 Mar</p>
            </div>
            <div className={"flex items-center gap-[8px]"}>
              <ClockIcon className={"text-text-grey"} />
              <p className={"text-[14px] font-medium text-text-grey"}>04:00PM - 11:00PM</p>
            </div>
            <div className={"flex items-center gap-[8px]"}>
              <MapPinIcon className={"text-text-grey"} />
              <p className={"text-[14px] font-medium text-text-grey"}>Lekki phase 1</p>
            </div>
          </div>
          <p className={"text-[16px] font-semiBold"}>Contact Us</p>
          <p className={"text-[16px] font-semiBold"}>About Event</p>
          <p className={"text-[14px] font-normal text-text-grey"}>
            This is the content of the message for the event you are seeing here
          </p>
          <p className={"text-[16px] font-semiBold"}>Promotions</p>
          <div className={"flex flex-wrap gap-[12px]"}>
            <div
              className={
                "flex w-fit items-center gap-[] rounded-[12px] border-[1px] border-light-green-tint bg-light-tint p-[8px]"
              }
            >
              <p className={"text-[14px] font-medium"}>IG Feed</p>
              <ChevronRight className={"w-[20px] text-grey-40"} />
            </div>
            <div
              className={
                "flex w-fit items-center gap-[] rounded-[12px] border-[1px] border-light-green-tint bg-light-tint p-[8px]"
              }
            >
              <p className={"text-[14px] font-medium"}>IG Story</p>
              <ChevronRight className={"w-[20px] text-grey-40"} />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default PromotionDetailsPage;
