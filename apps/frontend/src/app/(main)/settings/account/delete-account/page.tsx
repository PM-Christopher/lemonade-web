"use client";
import React from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import ChatIcon from "@/images/icons/chatIcon.svg";
import CalendarIcon from "@/images/icons/calendarIcon.svg";
import BagIcon from "@/images/icons/caseIcon.svg";
import BankIcon from "@/images/icons/bankIcon.svg";
import SuppprtIcon from "@/images/icons/supportIcon.svg";
import ChevronRight from "@/images/icons/chevronRight.svg";
import { Button } from "@lemonade/ui";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";

const DeleteAccountPage = () => {
  const router = useRouter();
  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-t-[1px] border-b-[1px] bg-white p-[8px] px-[64px]">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-[12px] p-[4px] pr-[16px] pl-[4px]"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Delete account</p>
          </div>
        </div>
        <section className="mt-4 flex flex-col items-center">
          <div className="laptop:w-[640px] laptop:bg-white flex w-full flex-col gap-4 rounded-[12px] bg-none p-[24px]">
            <p className="text-light-black max-w-[592px] text-[14px] font-normal">
              Deleting your account permanently removes your data from our system. You will have a{" "}
              <span className="font-semibold">30-day</span> grace period to change your mind. If you
              log in to your account within 30 days of deletion, your account will be reactivated.
            </p>
            <div className="bg-light_grey mt-[24px] flex flex-col gap-[16px] p-[16px]">
              <p className="text-[14px] font-semibold">Before you go, make sure</p>
              <div className="flex items-center gap-2">
                <ChatIcon />
                <p className="text-black-light text-[14px] font-normal">
                  You have deleted all Tribes you created
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <p className="text-black-light text-[14px] font-normal">
                  You have no active events you created
                </p>
              </div>
              <div className="flex items-center gap-2">
                <BagIcon />
                <p className="text-black-light text-[14px] font-normal">
                  You have completed all pending jobs
                </p>
              </div>
              <div className="flex items-center gap-2">
                <BankIcon />
                <p className="text-black-light text-[14px] font-normal">
                  You request wallet withdrawal from ticket sales, and completed jobs to your local
                  bank
                </p>
              </div>
              <p className="text-light-black text-[14px] font-normal">
                Your account cannot be deleted if these criteria are not met
              </p>
            </div>
            <div className="mt-[36px] flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <SuppprtIcon />
                <p className="font-semi-normal text-[14px]">
                  Reach out to support for any pending issues
                </p>
              </div>
              <ChevronRight />
            </div>
            <div className="mt-[24px] flex justify-between gap-[16px]">
              <Button
                className="border-red-2 bg-red-1 h-[48px] w-full rounded-[12px] border-[1px] shadow-none"
                onClick={() => router.push("/settings/account/confirm-delete")}
              >
                <p className="font-semi-normal text-[16px]">Delete account</p>
              </Button>
              <Button className="h-[48px] w-full border-none bg-transparent shadow-none">
                <p className="font-semi-normal text-light-green text-[16px]">Cancel</p>
              </Button>
            </div>
          </div>
        </section>
      </section>
    </MainLayout>
  );
};

export default DeleteAccountPage;
