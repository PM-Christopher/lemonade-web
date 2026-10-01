import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import moment from "moment";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

type VPInterface = {
  toggle: () => void;
  toggleMore: () => void;
  isOpen: boolean;
  event: any;
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
        <div className="w-[480px] rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
            </div>
          </div>
          <div className="mt-[24px]">
            <div className="flex justify-center">
              <Image src={"/images/tickets.png"} alt="promotion_payment" width={160} height={160} />
            </div>
          </div>
          <div className="mt-[24px]">
            <div className="flex flex-col">
              <p className="text-light-green text-center font-sans text-[20px] leading-[28px] font-semibold">
                Payment successful!
              </p>
              <p className="tracking-custom text-light-black text-center font-sans text-[14px] leading-[24px] font-normal">
                Tickets have been sent to the email addresses of all the attending guests.
              </p>
            </div>
          </div>
          <div className="mt-[24px]">
            <div className="flex flex-col">
              <p className="font-sans text-[20px] leading-[20px] font-semibold">
                {event?.data?.event?.event_name}
              </p>
            </div>
          </div>
          <div className="mt-[24px]">
            <div className="flex flex-col">
              <p className="text-text-grey font-sans text-[14px] leading-[20px] font-normal">
                Date
              </p>
              <p className="text-light-black-[20px] font-semi-normal tracking-custom font-sans text-[14px] leading-[21px]">
                {moment(event?.data?.event?.start_date).format("ddd, MMM DD").toUpperCase()}
              </p>
            </div>
          </div>
          <div className="mt-[24px]">
            <div className="flex flex-col">
              <p className="text-text-grey font-sans text-[14px] leading-[20px] font-normal">
                Time
              </p>
              <p className="text-light-black-[20px] font-semi-normal tracking-custom font-sans text-[14px] leading-[21px]">
                {moment(event?.data?.event?.start_date).format("h A").toUpperCase()}
              </p>
            </div>
          </div>
          {/*<div className="mt-[24px]">*/}
          {/*    <div className="flex flex-col">*/}
          {/*        <p className="font-sans font-normal text-[14px] text-text-grey leading-[20px]">Ticket Type</p>*/}
          {/*        <p className="font-sans font-semi-normal text-[14px] text-light-black-[20px] tracking-custom leading-[21px]">1</p>*/}
          {/*    </div>*/}
          {/*</div>*/}
          {/*<div className="mt-[24px]">*/}
          {/*    <div className="flex flex-col">*/}
          {/*        <p className="font-sans font-normal text-[14px] text-text-grey leading-[20px]">Ticket ID</p>*/}
          {/*        <p className="font-sans font-semi-normal text-[14px] text-light-black-[20px] tracking-custom leading-[21px]">₦500,000</p>*/}
          {/*    </div>*/}
          {/*</div>*/}
          <div className="mt-[40px] flex gap-[4px]">
            <button
              className="border-light-grey-50 w-full rounded-[12px] border-[1px] p-[10px] px-[14px]"
              onClick={toggle}
            >
              <p className="font-semi-normal text-black-light font-sans text-[16px]">More events</p>
            </button>
            <button
              className="auth-button border-step-color shadow-custom-bottom rounded-[12px] p-[10px] px-[14px]"
              onClick={toggleMore}
            >
              <p className="font-semi-normal font-sans text-[16px] text-white">My tickets</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default VerifyPaymentModal;
