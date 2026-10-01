import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import ChevronRightFilled from "@/images/icons/chevronRightFilled.svg";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

type PDInterface = {
  toggle: () => void;
  isOpen: boolean;
  promotion: any;
};

const PromotionDetailsModal: React.FC<PDInterface> = ({ toggle, isOpen, promotion }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{promotion?.name || "Promotion details"}</DialogTitle>
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
              <p className="tracking-custom font-sans text-[18px] leading-[27px] font-semibold">
                {promotion?.name}
              </p>
              {promotion?.status === "active" ? (
                <div className="bg-light-green-60 w-fit rounded-[8px] p-[4px] px-[8px]">
                  <p className="tracking-custom text-light-green-70 font-sans text-[14px] leading-[24px] font-normal">
                    Active
                  </p>
                </div>
              ) : (
                <div className="bg-warning w-fit rounded-[8px] p-[4px] px-[8px]">
                  <p className="tracking-custom text-warning-bold font-sans text-[14px] leading-[24px] font-normal">
                    Pending
                  </p>
                </div>
              )}
              <div className="bg-green-tint mt-[16px] rounded-[12px] p-[16px]">
                <p className="tracking-custom text-mid-green text-center font-sans text-[14px] leading-[24px] font-semibold">
                  Scheduled for {promotion?.promotion_date}
                </p>
              </div>
              <div className="bg-mid-grey mt-[16px] rounded-[12px] p-[24px]">
                <p className="font-sans text-[16px] font-semibold">BREAKDOWN</p>
                <div className="mt-[12px] flex flex-col">
                  {promotion?.breakdown.length > 0 &&
                    promotion?.breakdown.map((item: any, index: number) => (
                      <div className="my-[10px] flex items-center gap-[8px]" key={index}>
                        <ChevronRightFilled />
                        <p className="tracking-custom text-black-light font-sans text-[14px] leading-[21px] font-normal">
                          {item}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default PromotionDetailsModal;
