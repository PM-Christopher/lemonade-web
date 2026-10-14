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
        <div className="w-90 rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">Add to balance</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            <div className={"flex flex-col gap-1"}>
              <p className={"text-text-grey text-body-s font-normal"}>Amount</p>
              <input
                className={"bg-light-grey text-body-s h-12 gap-3 rounded-xl p-3"}
                placeholder={"N3000"}
              />
            </div>
            <p className={"text-light-black text-body-s font-normal"}>
              Wallet balance: <span className={"font-sans font-bold"}>N300,000</span>
            </p>
          </div>
          <div className={"flex justify-between gap-4 px-4 pb-2.5"}>
            <button
              className={"border-light-grey-50 w-full rounded-xl border bg-white px-12 py-2.75"}
            >
              <p className={"text-body-l font-medium text-black"}>Cancel</p>
            </button>
            <button
              className={
                "border-step-color bg-gradient-green w-full rounded-xl border px-12 py-2.75"
              }
            >
              <p className={"text-body-l font-medium text-white"}>Confirm</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default BalanceModal;
