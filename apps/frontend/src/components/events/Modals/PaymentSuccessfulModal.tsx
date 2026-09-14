import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import PromotionImage from "@/images/promoteEventIcon.png";
import { formatLongDate } from "@/lib/dateTimeFormatter";
import { formatNumberWithCommas } from "@/lib/formatNumber";

type PSInterface = {
  toggle: () => void;
  isOpen: boolean;
  promotion: any;
};

const PaymentSuccessfulModal: React.FC<PSInterface> = ({ toggle, isOpen, promotion }) => {
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
        <div className="mt-[24px]">
          <div className="flex justify-center">
            <Image
              src={"/images/promoteEventIcon.png"}
              alt="promotion_payment"
              width={160}
              height={160}
            />
          </div>
        </div>
        <div className="mt-[24px]">
          <div className="flex flex-col">
            <p className="text-center font-sans text-[20px] font-semibold leading-[28px] text-light-green">
              Payment successful!
            </p>
            <p className="text-center font-sans text-[14px] font-normal leading-[24px] tracking-custom text-light-black">
              Your payment has been processed. You will get an update on when your event is
              scheduled for promotion.
            </p>
          </div>
        </div>
        <div className="mt-[24px]">
          <div className="flex flex-col">
            <p className="font-sans text-[20px] font-semibold leading-[20px]">{promotion?.name}</p>
          </div>
        </div>
        <div className="mt-[24px]">
          <div className="flex flex-col">
            <p className="font-sans text-[14px] font-normal leading-[20px] text-text-grey">Date</p>
            <p className="text-light-black-[20px] font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom">
              {formatLongDate(promotion?.promotion_date, "mid")?.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="mt-[24px]">
          <div className="flex flex-col">
            <p className="font-sans text-[14px] font-normal leading-[20px] text-text-grey">Unit</p>
            <p className="text-light-black-[20px] font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom">
              1
            </p>
          </div>
        </div>
        <div className="mt-[24px]">
          <div className="flex flex-col">
            <p className="font-sans text-[14px] font-normal leading-[20px] text-text-grey">
              Amount
            </p>
            <p className="text-light-black-[20px] font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom">
              ₦{formatNumberWithCommas(promotion?.price)}
            </p>
          </div>
        </div>
        <div className="mt-[40px]">
          <button
            className="auth-button rounded-[12px] border-step-color p-[10px] px-[14px] shadow-custom-bottom"
            onClick={toggle}
          >
            <p className="font-sans text-[16px] font-semi-normal text-white">Go to event</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessfulModal;
