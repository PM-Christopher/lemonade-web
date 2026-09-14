import React from "react";
import CloseIcon from "@/images/icons/close.svg";

const BoostDetailsModal = ({
  boost,
  isOpen,
  toggleMenu,
}: {
  boost: any;
  isOpen: boolean;
  toggleMenu: () => void;
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="w-[343px] rounded-lg bg-white shadow-lg laptop:w-[480px]">
        <div className="mt-[16px] flex items-center justify-between p-[4px] px-[16px]">
          <p className="text-[16px] font-semiBold">Boosting details</p>
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={toggleMenu}>
              <CloseIcon />
            </div>
          </div>
        </div>
        <div className="mt-[16px] flex flex-col">
          <div className="flex flex-col p-[16px]">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-normal text-text-grey">Package</p>
              <p className="text-[14px] font-semi-normal">Featured</p>
            </div>
            <div className="mt-[24px] flex items-center justify-between">
              <p className="text-[14px] font-normal text-text-grey">Duration</p>
              <p className="text-[14px] font-semi-normal">{boost?.duration} days</p>
            </div>
            <div className="mt-[24px] flex items-center justify-between">
              <p className="text-[14px] font-normal text-text-grey">Start date</p>
              <p className="text-[14px] font-semi-normal">{boost?.full_start_date}</p>
            </div>
            <div className="mt-[24px] flex items-center justify-between">
              <p className="text-[14px] font-normal text-text-grey">End date</p>
              <p className="text-[14px] font-semi-normal">{boost?.full_end_date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoostDetailsModal;
