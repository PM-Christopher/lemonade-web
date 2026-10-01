import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import { formatLongDate } from "@/lib/dateTimeFormatter";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

interface Promotion {
  name?: string;
  promotion_date?: string;
  price?: number;
}

type PSInterface = {
  toggle: () => void;
  isOpen: boolean;
  promotion: Promotion | null;
};

const PaymentSuccessfulModal: React.FC<PSInterface> = ({ toggle, isOpen, promotion }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Payment successful!"}</DialogTitle>
        <div className="w-[480px] rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-center">
              <Image
                src={"/images/promoteEventIcon.png"}
                alt="promotion_payment"
                width={160}
                height={160}
              />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-light-green text-center font-sans text-[20px] leading-[28px] font-semibold">
                Payment successful!
              </p>
              <p className="tracking-custom text-light-black text-center font-sans text-[14px] leading-[24px] font-normal">
                Your payment has been processed. You will get an update on when your event is
                scheduled for promotion.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="font-sans text-[20px] leading-[20px] font-semibold">
                {promotion?.name}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-text-grey font-sans text-[14px] leading-[20px] font-normal">
                Date
              </p>
              <p className="text-light-black-[20px] font-semi-normal tracking-custom font-sans text-[14px] leading-[21px]">
                {formatLongDate(promotion?.promotion_date, "mid")?.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-text-grey font-sans text-[14px] leading-[20px] font-normal">
                Unit
              </p>
              <p className="text-light-black-[20px] font-semi-normal tracking-custom font-sans text-[14px] leading-[21px]">
                1
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-text-grey font-sans text-[14px] leading-[20px] font-normal">
                Amount
              </p>
              <p className="text-light-black-[20px] font-semi-normal tracking-custom font-sans text-[14px] leading-[21px]">
                ₦{formatNumberWithCommas(promotion?.price)}
              </p>
            </div>
          </div>
          <div className="mt-10">
            <button
              className="auth-button border-step-color shadow-custom-bottom rounded-xl p-2.5 px-3.5"
              onClick={toggle}
            >
              <p className="font-semi-normal font-sans text-[16px] text-white">Go to event</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default PaymentSuccessfulModal;
