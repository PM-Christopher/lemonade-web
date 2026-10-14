import { images } from "@/lib/images";
import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import moment from "moment";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

export interface VerifiedEvent {
  data?: {
    event?: {
      event_name?: string;
      start_date?: string;
    };
  };
}

type VPInterface = {
  toggle: () => void;
  toggleMore: () => void;
  isOpen: boolean;
  event: VerifiedEvent | undefined;
};

const VerifyPaymentModal: React.FC<VPInterface> = ({ toggle, isOpen, event, toggleMore }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Payment successful!"}</DialogTitle>
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
              <Image src={images.TICKETS} alt="promotion_payment" width={160} height={160} />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-light-green text-title-r text-center font-sans font-semibold">
                Payment successful!
              </p>
              <p className="tracking-custom text-light-black text-body-s text-center font-sans leading-6 font-normal">
                Tickets have been sent to the email addresses of all the attending guests.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-title-r font-sans leading-5 font-semibold">
                {event?.data?.event?.event_name}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-text-grey text-body-s font-sans leading-5 font-normal">Date</p>
              <p className="font-semi-normal tracking-custom text-body-s font-sans">
                {moment(event?.data?.event?.start_date).format("ddd, MMM DD").toUpperCase()}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col">
              <p className="text-text-grey text-body-s font-sans leading-5 font-normal">Time</p>
              <p className="font-semi-normal tracking-custom text-body-s font-sans">
                {moment(event?.data?.event?.start_date).format("h A").toUpperCase()}
              </p>
            </div>
          </div>
          {/*<div className="mt-6">*/}
          {/*    <div className="flex flex-col">*/}
          {/*        <p className="font-sans font-normal text-body-s text-text-grey leading-5">Ticket Type</p>*/}
          {/*        <p className="font-sans font-semi-normal text-body-s tracking-custom">1</p>*/}
          {/*    </div>*/}
          {/*</div>*/}
          {/*<div className="mt-6">*/}
          {/*    <div className="flex flex-col">*/}
          {/*        <p className="font-sans font-normal text-body-s text-text-grey leading-5">Ticket ID</p>*/}
          {/*        <p className="font-sans font-semi-normal text-body-s tracking-custom">₦500,000</p>*/}
          {/*    </div>*/}
          {/*</div>*/}
          <div className="mt-10 flex gap-1">
            <button
              className="border-light-grey-50 w-full rounded-xl border p-2.5 px-3.5"
              onClick={toggle}
            >
              <p className="font-semi-normal text-black-light text-body-l font-sans">More events</p>
            </button>
            <button
              className="auth-button border-step-color shadow-custom-bottom rounded-xl p-2.5 px-3.5"
              onClick={toggleMore}
            >
              <p className="font-semi-normal text-body-l font-sans text-white">My tickets</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default VerifyPaymentModal;
