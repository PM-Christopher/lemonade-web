import React from "react";
import { XIcon } from "lucide-react";

interface BalanceModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const BalanceModal: React.FC<BalanceModalProps> = ({ isOpen, toggle }) => {
  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="w-[360px] rounded-[12px] bg-white pb-[4px] pt-[16px]">
        <div className={"px-[16px] py-[4px]"}>
          <div className="flex items-center justify-between">
            <p className="font-sans text-[18px] font-semibold leading-[27px]">Add to balance</p>
            <div className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </div>
          </div>
        </div>
        <div className={"flex flex-col gap-[16px] px-[16px] py-[16px]"}>
          <div className={"flex flex-col gap-[4px]"}>
            <p className={"text-[14px] font-normal text-text-grey"}>Amount</p>
            <input
              className={"h-[48px] gap-[12px] rounded-[12px] bg-light-grey p-[12px] text-[14px]"}
              placeholder={"N3000"}
            />
          </div>
          <p className={"text-[14px] font-normal text-light-black"}>
            Wallet balance: <span className={"font-sans font-bold"}>N300,000</span>
          </p>
        </div>
        <div className={"flex justify-between gap-[16px] px-[16px] pb-[10px]"}>
          <button
            className={
              "w-full rounded-[12px] border-[1px] border-light-grey-50 bg-white px-[48px] py-[11px]"
            }
          >
            <p className={"text-[16px] font-medium text-black"}>Cancel</p>
          </button>
          <button
            className={
              "w-full rounded-[12px] border-[1px] border-step-color bg-gradient-green px-[48px] py-[11px]"
            }
          >
            <p className={"text-[16px] font-medium text-white"}>Confirm</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceModal;
