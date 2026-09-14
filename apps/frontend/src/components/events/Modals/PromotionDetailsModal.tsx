import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import ChevronRightFilled from "@/images/icons/chevronRightFilled.svg";

type PDInterface = {
  toggle: () => void;
  isOpen: boolean;
  promotion: any;
};

const PromotionDetailsModal: React.FC<PDInterface> = ({ toggle, isOpen, promotion }) => {
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
          <div className="flex flex-col">
            <p className="font-sans text-[18px] font-semibold leading-[27px] tracking-custom">
              {promotion?.name}
            </p>
            {promotion?.status === "active" ? (
              <div className="w-fit rounded-[8px] bg-light-green-60 p-[4px] px-[8px]">
                <p className="font-sans text-[14px] font-normal leading-[24px] tracking-custom text-light-green-70">
                  Active
                </p>
              </div>
            ) : (
              <div className="w-fit rounded-[8px] bg-warning p-[4px] px-[8px]">
                <p className="font-sans text-[14px] font-normal leading-[24px] tracking-custom text-warning-bold">
                  Pending
                </p>
              </div>
            )}
            <div className="mt-[16px] rounded-[12px] bg-green-tint p-[16px]">
              <p className="text-center font-sans text-[14px] font-semibold leading-[24px] tracking-custom text-mid-green">
                Scheduled for {promotion?.promotion_date}
              </p>
            </div>
            <div className="mt-[16px] rounded-[12px] bg-mid-grey p-[24px]">
              <p className="font-sans text-[16px] font-semibold">BREAKDOWN</p>
              <div className="mt-[12px] flex flex-col">
                {promotion?.breakdown.length > 0 &&
                  promotion?.breakdown.map((item: any, index: number) => (
                    <div className="my-[10px] flex items-center gap-[8px]" key={index}>
                      <ChevronRightFilled />
                      <p className="font-sans text-[14px] font-normal leading-[21px] tracking-custom text-black-light">
                        {item}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailsModal;
