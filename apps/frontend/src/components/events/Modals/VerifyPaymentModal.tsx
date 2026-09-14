import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import moment from "moment";

type VPInterface = {
  toggle: () => void;
  toggleMore: () => void;
  isOpen: boolean;
  event: any;
};

const VerifyPaymentModal: React.FC<VPInterface> = ({ toggle, isOpen, event, toggleMore }) => {
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
            <Image src={"/images/tickets.png"} alt="promotion_payment" width={160} height={160} />
          </div>
        </div>
        <div className="mt-[24px]">
          <div className="flex flex-col">
            <p className="text-center font-sans text-[20px] font-semibold leading-[28px] text-light-green">
              Payment successful!
            </p>
            <p className="text-center font-sans text-[14px] font-normal leading-[24px] tracking-custom text-light-black">
              Tickets have been sent to the email addresses of all the attending guests.
            </p>
          </div>
        </div>
        <div className="mt-[24px]">
          <div className="flex flex-col">
            <p className="font-sans text-[20px] font-semibold leading-[20px]">
              {event?.data?.event?.event_name}
            </p>
          </div>
        </div>
        <div className="mt-[24px]">
          <div className="flex flex-col">
            <p className="font-sans text-[14px] font-normal leading-[20px] text-text-grey">Date</p>
            <p className="text-light-black-[20px] font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom">
              {moment(event?.data?.event?.start_date).format("ddd, MMM DD").toUpperCase()}
            </p>
          </div>
        </div>
        <div className="mt-[24px]">
          <div className="flex flex-col">
            <p className="font-sans text-[14px] font-normal leading-[20px] text-text-grey">Time</p>
            <p className="text-light-black-[20px] font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom">
              {moment(event?.data?.event?.start_date).format("h A").toUpperCase()}
            </p>
          </div>
        </div>
        {/*<div className="mt-[24px]">*/}
        {/*    <div className="flex flex-col">*/}
        {/*        <p className="font-sans font-normal text-[14px] text-text-grey leading-[20px]">Ticket Type</p>*/}
        {/*        <p className="font-sans font-semi-normal text-[14px] text-light-black-[20px] tracking-custom leading-[21px]">1</p>*/}
        {/*    </div>*/}
        {/*</div>*/}
        {/*<div className="mt-[24px]">*/}
        {/*    <div className="flex flex-col">*/}
        {/*        <p className="font-sans font-normal text-[14px] text-text-grey leading-[20px]">Ticket ID</p>*/}
        {/*        <p className="font-sans font-semi-normal text-[14px] text-light-black-[20px] tracking-custom leading-[21px]">₦500,000</p>*/}
        {/*    </div>*/}
        {/*</div>*/}
        <div className="mt-[40px] flex gap-[4px]">
          <button
            className="w-full rounded-[12px] border-[1px] border-light-grey-50 p-[10px] px-[14px]"
            onClick={toggle}
          >
            <p className="font-sans text-[16px] font-semi-normal text-black-light">More events</p>
          </button>
          <button
            className="auth-button rounded-[12px] border-step-color p-[10px] px-[14px] shadow-custom-bottom"
            onClick={toggleMore}
          >
            <p className="font-sans text-[16px] font-semi-normal text-white">My tickets</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPaymentModal;
