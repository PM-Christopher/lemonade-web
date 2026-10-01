import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { CalendarIcon, ChevronRight, ClockIcon, MapPinIcon } from "lucide-react";

const PromotionDetailsPage = ({}) => {
  return (
    <MainLayout>
      <section className={"flex justify-between p-5"}>
        <div className={"flex h-fit w-[588px] flex-col gap-3 rounded-xl bg-white"}>
          <div className={"flex items-center justify-between border-b p-6"}>
            <p className={"font-semiBold text-[16px]"}>Event summary</p>
          </div>
          <div className={"flex flex-col gap-5 p-6"}>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Event Name:</p>
              </div>
              <p className={"text-[14px] font-medium"}>Unlocking business potentials</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Event Owner:</p>
              </div>
              <div className={"flex gap-1"}>
                <p className={"text-[14px] font-medium"}>Adebayo Akintoye</p>
                <p className={"text-light-green text-[14px] font-medium"}>Open chat</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Event ID:</p>
              </div>
              <p className={"text-[14px] font-medium"}>PR112332</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Promotion Name:</p>
              </div>
              <p className={"text-[14px] font-medium"}>Instagram Feed Post</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Amount:</p>
              </div>
              <div className={"flex gap-1"}>
                <p className={"text-[14px] font-medium"}>N30,000</p>
              </div>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Date Paid:</p>
              </div>
              <p className={"text-[14px] font-medium"}>23 Apr, 2024 09:45 PM</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Promotion Date:</p>
              </div>
              <p className={"text-[14px] font-medium"}>N/A</p>
            </div>
            <div className={"items-center-center flex gap-6"}>
              <div className={"w-[115px]"}>
                <p className={"text-text-grey text-[12px] font-medium"}>Promotion Status:</p>
              </div>
              <p className={"text-warning-bold text-[14px] font-medium"}>Pending</p>
            </div>
            <div className={"items-center-center mt-10 flex justify-between gap-6"}>
              <button
                className={"border-light-grey-50 w-[299px] rounded-xl border-2 px-12 py-[11px]"}
                type={"button"}
              >
                Mark as completed
              </button>
              <button
                className={
                  "border-step-color bg-gradient-green w-[299px] rounded-xl border px-12 py-[11px] text-[16px] font-medium text-white"
                }
                type={"button"}
              >
                Schedule
              </button>
            </div>
          </div>
        </div>

        <div
          className={"flex h-fit w-[880px] flex-col gap-4 rounded-tl-xl rounded-tr-xl bg-white p-6"}
        >
          <div className={"h-[343px] w-80 rounded-2xl bg-gray-600"}></div>
          <p className={"font-semiBold text-[20px]"}>Unlocking business potentials</p>
          <div className={"flex flex-col gap-2"}>
            <div className={"flex items-center gap-2"}>
              <CalendarIcon className={"text-text-grey"} />
              <p className={"text-text-grey text-[14px] font-medium"}>Mon, 23 Mar - Mon 23 Mar</p>
            </div>
            <div className={"flex items-center gap-2"}>
              <ClockIcon className={"text-text-grey"} />
              <p className={"text-text-grey text-[14px] font-medium"}>04:00PM - 11:00PM</p>
            </div>
            <div className={"flex items-center gap-2"}>
              <MapPinIcon className={"text-text-grey"} />
              <p className={"text-text-grey text-[14px] font-medium"}>Lekki phase 1</p>
            </div>
          </div>
          <p className={"font-semiBold text-[16px]"}>Contact Us</p>
          <p className={"font-semiBold text-[16px]"}>About Event</p>
          <p className={"text-text-grey text-[14px] font-normal"}>
            This is the content of the message for the event you are seeing here
          </p>
          <p className={"font-semiBold text-[16px]"}>Promotions</p>
          <div className={"flex flex-wrap gap-3"}>
            <div
              className={
                "gap-[] border-light-green-tint bg-light-tint flex w-fit items-center rounded-xl border p-2"
              }
            >
              <p className={"text-[14px] font-medium"}>IG Feed</p>
              <ChevronRight className={"text-grey-40 w-5"} />
            </div>
            <div
              className={
                "gap-[] border-light-green-tint bg-light-tint flex w-fit items-center rounded-xl border p-2"
              }
            >
              <p className={"text-[14px] font-medium"}>IG Story</p>
              <ChevronRight className={"text-grey-40 w-5"} />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default PromotionDetailsPage;
