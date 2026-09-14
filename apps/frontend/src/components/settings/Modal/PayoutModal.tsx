import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type PayoutInterface = {
  isOpen: boolean;
  toggle: () => void;
};

const PayoutModal: React.FC<PayoutInterface> = ({ isOpen, toggle }) => {
  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="w-[480px] rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={toggle}>
              <CloseIcon />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="flex flex-col items-center">
            <div>
              <Image src={"/images/Payout.png"} alt="payout" width={311} height={160} />
            </div>
            <div className="mt-[24px]">
              <p className="text-center text-[20px] font-semibold">Payout requested</p>
              <p className="max-w-[416px] text-center text-[16px] font-normal">
                Your payment is being processed and will be disbursed into the account details
                provided below
              </p>
            </div>
            <div className="mt-[24px] w-full rounded-[12px] bg-light-tint p-[16px]">
              <div className="rounded-[12px] bg-light-tint-3 p-[8px]">
                <p className="text-center text-[12px] font-normal text-text-grey">Payout amount</p>
                <p className="text-center text-[20px] font-semibold text-black-light">N2,000</p>
              </div>
              <div className="my-[16px] flex justify-between">
                <p className="text-[14px] font-normal">Account name</p>
                <p className="text-[14px] font-semi-normal">Christine Joseph</p>
              </div>
              <div className="my-[16px] flex justify-between">
                <p className="text-[14px] font-normal">Bank name</p>
                <p className="text-[14px] font-semi-normal">United Bank for Africa</p>
              </div>
              <div className="my-[16px] flex justify-between">
                <p className="text-[14px] font-normal">Account number</p>
                <p className="text-[14px] font-semi-normal">0823212345</p>
              </div>
            </div>

            <Button className="mt-[48px] h-[48px] w-full rounded-[12px] border-step-color bg-gradient-green p-[14px] px-[48px] shadow-custom-bottom">
              <p>Done</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutModal;
