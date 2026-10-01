import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { payoutHistoryData } from "@/data/walletData";

type PayoutHistoryInterface = {
  isOpen: boolean;
  toggle: () => void;
};

const PayoutHistory: React.FC<PayoutHistoryInterface> = ({ isOpen, toggle }) => {
  if (!isOpen) return null;

  const renderStyle = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-warning text-warning-bold";
      case "Successful":
        return "bg-light-green-60 text-light-green-70";
      case "Failed":
        return "bg-red-accent-1 text-red-1";
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="fixed top-5 right-5 bottom-5 left-auto w-fit max-w-none translate-x-0 translate-y-0 gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Payout history</DialogTitle>
        <div className="flex h-full flex-col rounded-[12px] bg-white" style={{ width: "585px" }}>
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
                Payout history
              </p>
            </div>
            <div>
              <XIcon className="cursor-pointer" onClick={toggle} />
            </div>
          </div>
          <div className={"mt-[16px] flex flex-col px-[24px]"}>
            {payoutHistoryData.map((item, index: number) => (
              <div key={index} className={"flex justify-between px-[16px] pt-[16px] pb-[24px]"}>
                <div className={"flex flex-col"}>
                  <p className={"text-[14px] font-medium"}>{item.amount}</p>
                  <p className={"text-text-grey text-[12px] font-normal"}>{item.date}</p>
                </div>
                <p
                  className={`h-fit rounded-[8px] px-[8px] py-[4px] text-[12px] font-medium ${renderStyle(item.status)}`}
                >
                  {item.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default PayoutHistory;
