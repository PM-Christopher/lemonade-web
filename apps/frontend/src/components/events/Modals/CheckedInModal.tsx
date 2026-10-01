import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import type { GuestDetails } from "@/components/events/GuestSideMenu";

type CheckedInInterface = {
  toggle: () => void;
  isOpen: boolean;
  guestDetails: GuestDetails;
};

const CheckedInModal: React.FC<CheckedInInterface> = ({ toggle, isOpen, guestDetails }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Check in Successful!"}</DialogTitle>
        <div className="w-[480px] rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-center">
              <Image src={"/images/checkIn.png"} alt="check in" width={311} height={160} />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-black-light text-center font-sans text-[20px] leading-[28px] font-semibold">
                Check in Successful!
              </p>
              <p className="tracking-custom text-light-black text-center font-sans text-[16px] leading-[24px] font-normal">
                Guest with ticket ID {guestDetails?.ticket?.ticket_id?.toUpperCase()} has been
                successfully checked in.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <button
              className="auth-button border-step-color shadow-custom-bottom rounded-xl p-2.5 px-3.5"
              onClick={toggle}
            >
              <p className="font-semi-normal font-sans text-[16px] text-white">Done</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default CheckedInModal;
