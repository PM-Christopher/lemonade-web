import { images } from "@/lib/images";
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
        <div className="w-120 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-center">
              <Image src={images.PROMOTE_EVENT} alt="promotion_payment" width={160} height={160} />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-light-green text-title-r text-center font-sans font-semibold">
                Payment successful!
              </p>
              <p className="tracking-custom text-light-black text-body-s text-center font-sans leading-6 font-normal">
                Your payment has been processed. You will get an update on when your event is
                scheduled for promotion.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-title-r font-sans leading-5 font-semibold">{promotion?.name}</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-text-grey text-body-s font-sans leading-5 font-normal">Date</p>
              <p className="font-semi-normal tracking-custom text-body-s font-sans">
                {formatLongDate(promotion?.promotion_date, "mid")?.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-text-grey text-body-s font-sans leading-5 font-normal">Unit</p>
              <p className="font-semi-normal tracking-custom text-body-s font-sans">1</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-text-grey text-body-s font-sans leading-5 font-normal">Amount</p>
              <p className="font-semi-normal tracking-custom text-body-s font-sans">
                ₦{formatNumberWithCommas(promotion?.price)}
              </p>
            </div>
          </div>
          <div className="mt-10">
            <button
              className="auth-button border-step-color shadow-custom-bottom rounded-xl p-2.5 px-3.5"
              onClick={toggle}
            >
              <p className="font-semi-normal text-body-l font-sans text-white">Go to event</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default PaymentSuccessfulModal;
