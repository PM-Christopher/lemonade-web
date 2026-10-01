import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { referralHistoryData } from "@/data/walletData";

type ReferralHistoryInterface = {
  isOpen: boolean;
  toggle: () => void;
};

const ReferralHistory: React.FC<ReferralHistoryInterface> = ({ isOpen, toggle }) => {
  if (!isOpen) return null;
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="fixed top-5 right-5 bottom-5 left-auto w-fit max-w-none translate-x-0 translate-y-0 gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Referral history</DialogTitle>
        <div className="flex h-full flex-col rounded-xl bg-white" style={{ width: "585px" }}>
          <div
            className="flex items-center justify-between"
            style={{
              paddingTop: "24px",
              paddingBottom: "8px",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <div>
              <p className="tracking-custom font-sans text-[16px] leading-[24px] font-semibold">
                Referral history
              </p>
            </div>
            <div>
              <XIcon className="cursor-pointer" onClick={toggle} />
            </div>
          </div>
          <div className={"mt-4 flex flex-col px-6"}>
            {referralHistoryData.map((item, index: number) => (
              <div className={"flex justify-between px-4 pt-4 pb-6"} key={index}>
                <div className={"flex flex-col"}>
                  <p className={"text-[14px] font-medium"}>
                    {item.amount} - {item.type}
                  </p>
                  <p className={"text-text-grey text-[12px] font-normal"}>{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default ReferralHistory;
