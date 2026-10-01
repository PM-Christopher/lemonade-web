"use client";
import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button } from "@lemonade/ui";
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
      className={`bg-opacity-50 fixed inset-0 z-50 items-center justify-center bg-gray-800 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="laptop:h-screen laptop:w-[480px] h-full w-screen rounded-lg bg-white p-6 shadow-lg">
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
          <div className="px-2.5">
            <div className="mt-6 flex flex-col items-center">
              <p className="font-semiBold text-light-green text-center text-[20px]">
                Payment successful
              </p>
              <p className="w-[416px] text-center text-[14px] font-normal">
                Your payment has been processed and your business will be boosted from{" "}
                <span className="font-semi-normal">
                  {boost?.full_start_date} to {boost?.full_end_date}
                </span>
              </p>
            </div>
            <div className="mt-6">
              <p className="font-semiBold text-[20px]">Featured</p>
            </div>
            <div className="mt-6 flex flex-col">
              <p className="text-text-grey text-[14px] font-normal">Start date</p>
              <p className="font-semi-normal text-light-black text-[14px]">{boost?.start_date}</p>
            </div>

            <div className="mt-4 flex flex-col">
              <p className="text-text-grey text-[14px] font-normal">Start time</p>
              <p className="font-semi-normal text-light-black text-[14px]">{boost?.start_time}</p>
            </div>

            <div className="mt-4 flex flex-col">
              <p className="text-text-grey text-[14px] font-normal">Duration</p>
              <p className="font-semi-normal text-light-black text-[14px]">
                {boost?.duration} days
              </p>
            </div>
          </div>

          <Button
            className="bg-gradient-green mt-6 h-12 w-full"
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
