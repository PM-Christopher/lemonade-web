import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import ChevronRightFilled from "@/images/icons/chevronRightFilled.svg";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

interface Promotion {
  name?: string;
  status?: string;
  promotion_date?: string;
  breakdown?: string[];
}

type PDInterface = {
  toggle: () => void;
  isOpen: boolean;
  promotion: Promotion | null;
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
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="tracking-custom font-sans text-[18px] leading-[27px] font-semibold">
                {promotion?.name}
              </p>
              {promotion?.status === "active" ? (
                <div className="bg-light-green-60 w-fit rounded-[8px] p-1 px-2">
                  <p className="tracking-custom text-light-green-70 font-sans text-[14px] leading-[24px] font-normal">
                    Active
                  </p>
                </div>
              ) : (
                <div className="bg-warning w-fit rounded-[8px] p-1 px-2">
                  <p className="tracking-custom text-warning-bold font-sans text-[14px] leading-[24px] font-normal">
                    Pending
                  </p>
                </div>
              )}
              <div className="bg-green-tint mt-4 rounded-xl p-4">
                <p className="tracking-custom text-mid-green text-center font-sans text-[14px] leading-[24px] font-semibold">
                  Scheduled for {promotion?.promotion_date}
                </p>
              </div>
              <div className="bg-mid-grey mt-4 rounded-xl p-6">
                <p className="font-sans text-[16px] font-semibold">BREAKDOWN</p>
                <div className="mt-3 flex flex-col">
                  {promotion?.breakdown && promotion.breakdown.length > 0 &&
                    promotion.breakdown.map((item, index: number) => (
                      <div className="my-2.5 flex items-center gap-2" key={index}>
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
