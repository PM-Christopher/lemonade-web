import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

interface BalanceModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const BalanceModal: React.FC<BalanceModalProps> = ({ isOpen, toggle }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Add to balance</DialogTitle>
        <div className="w-[360px] rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] leading-[27px] font-semibold">Add to balance</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            <div className={"flex flex-col gap-1"}>
              <p className={"text-text-grey text-[14px] font-normal"}>Amount</p>
              <input
                className={"bg-light-grey h-12 gap-3 rounded-xl p-3 text-[14px]"}
                placeholder={"N3000"}
              />
            </div>
            <p className={"text-light-black text-[14px] font-normal"}>
              Wallet balance: <span className={"font-sans font-bold"}>N300,000</span>
            </p>
          </div>
          <div className={"flex justify-between gap-4 px-4 pb-2.5"}>
            <button
              className={"border-light-grey-50 w-full rounded-xl border bg-white px-12 py-[11px]"}
            >
              <p className={"text-[16px] font-medium text-black"}>Cancel</p>
            </button>
            <button
              className={
                "border-step-color bg-gradient-green w-full rounded-xl border px-12 py-[11px]"
              }
            >
              <p className={"text-[16px] font-medium text-white"}>Confirm</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default BalanceModal;
