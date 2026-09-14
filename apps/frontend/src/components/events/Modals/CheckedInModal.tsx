import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";

type CheckedInInterface = {
  toggle: () => void;
  isOpen: boolean;
  guestDetails: any;
};

const CheckedInModal: React.FC<CheckedInInterface> = ({ toggle, isOpen, guestDetails }) => {
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
            <Image src={"/images/checkIn.png"} alt="check in" width={311} height={160} />
          </div>
        </div>
        <div className="mt-[24px]">
          <div className="flex flex-col">
            <p className="text-center font-sans text-[20px] font-semibold leading-[28px] text-black-light">
              Check in Successful!
            </p>
            <p className="text-center font-sans text-[16px] font-normal leading-[24px] tracking-custom text-light-black">
              Guest with ticket ID {guestDetails?.ticket?.ticket_id.toUpperCase()} has been
              successfully checked in.
            </p>
          </div>
        </div>
        <div className="mt-[40px]">
          <button
            className="auth-button rounded-[12px] border-step-color p-[10px] px-[14px] shadow-custom-bottom"
            onClick={toggle}
          >
            <p className="font-sans text-[16px] font-semi-normal text-white">Done</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckedInModal;
