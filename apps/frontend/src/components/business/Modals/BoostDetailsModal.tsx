import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

interface Boost {
  duration?: number | null;
  full_start_date?: string;
  full_end_date?: string;
}

const BoostDetailsModal = ({
  boost,
  isOpen,
  toggleMenu,
}: {
  boost: Boost | null | undefined;
  isOpen: boolean;
  toggleMenu: () => void;
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggleMenu();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Boosting details"}</DialogTitle>
        <div className="laptop:w-[480px] w-[343px] rounded-lg bg-white shadow-lg">
          <div className="mt-4 flex items-center justify-between p-1 px-4">
            <p className="font-semiBold text-[16px]">Boosting details</p>
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggleMenu}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <div className="flex flex-col p-4">
              <div className="flex items-center justify-between">
                <p className="text-text-grey text-[14px] font-normal">Package</p>
                <p className="font-semi-normal text-[14px]">Featured</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-text-grey text-[14px] font-normal">Duration</p>
                <p className="font-semi-normal text-[14px]">{boost?.duration} days</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-text-grey text-[14px] font-normal">Start date</p>
                <p className="font-semi-normal text-[14px]">{boost?.full_start_date}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-text-grey text-[14px] font-normal">End date</p>
                <p className="font-semi-normal text-[14px]">{boost?.full_end_date}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default BoostDetailsModal;
