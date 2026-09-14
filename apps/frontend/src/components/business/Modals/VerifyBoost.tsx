"use client";
import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import PromoteEvent from "@/image/PromoteEventIcon.png";
import { useRouter } from "next/navigation";

const VerifyBoost = ({
  isOpen,
  toggleMenu,
  boost,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
  boost: any;
}) => {
  const router = useRouter();
  const backToBusiness = () => {
    toggleMenu();
    const currentPath = window.location.pathname;
    router.push(currentPath);
  };
  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="h-full w-screen rounded-lg bg-white p-6 shadow-lg laptop:h-screen laptop:w-[480px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={toggleMenu}>
              <CloseIcon />
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col">
          <div className="flex flex-col items-center">
            <Image src={"/images/promoteEventIcon.png"} alt="promote" width={160} height={160} />
          </div>
          <div className="px-[10px]">
            <div className="mt-[24px] flex flex-col items-center">
              <p className="text-center text-[20px] font-semiBold text-light-green">
                Payment successful
              </p>
              <p className="w-[416px] text-center text-[14px] font-normal">
                Your payment has been processed and your business will be boosted from{" "}
                <span className="font-semi-normal">
                  {boost?.full_start_date} to {boost?.full_end_date}
                </span>
              </p>
            </div>
            <div className="mt-[24px]">
              <p className="text-[20px] font-semiBold">Featured</p>
            </div>
            <div className="mt-[24px] flex flex-col">
              <p className="text-[14px] font-normal text-text-grey">Start date</p>
              <p className="text-[14px] font-semi-normal text-light-black">{boost?.start_date}</p>
            </div>

            <div className="mt-[16px] flex flex-col">
              <p className="text-[14px] font-normal text-text-grey">Start time</p>
              <p className="text-[14px] font-semi-normal text-light-black">{boost?.start_time}</p>
            </div>

            <div className="mt-[16px] flex flex-col">
              <p className="text-[14px] font-normal text-text-grey">Duration</p>
              <p className="text-[14px] font-semi-normal text-light-black">
                {boost?.duration} days
              </p>
            </div>
          </div>

          <Button
            className="mt-[24px] h-[48px] w-full bg-gradient-green"
            onClick={backToBusiness}
            type="button"
          >
            <p className="text-white">Go to business</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyBoost;
