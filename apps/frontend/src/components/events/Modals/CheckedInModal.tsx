import { images } from "@/lib/images";
import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import type { GuestDetails } from "@/features/events/api";

type CheckedInInterface = {
  toggle: () => void;
  isOpen: boolean;
  guestDetails: GuestDetails | undefined;
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
        <div className="w-120 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-center">
              <Image src={images.CHECK_IN} alt="check in" width={311} height={160} />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-black-light text-title-r text-center font-sans font-semibold">
                Check in Successful!
              </p>
              <p className="tracking-custom text-light-black text-body-l text-center font-sans font-normal">
                Guest with ticket ID {guestDetails?.ticket?.ticket_id?.toUpperCase()} has been
                successfully checked in.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <button
              className="auth-button border-step-color rounded-xl p-2.5 px-3.5"
              onClick={toggle}
            >
              <p className="font-semi-normal text-body-l font-sans text-white">Done</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default CheckedInModal;
