import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import CalendarIcon from "@/images/icons/calendar-large.svg";
import DotIcon from "@/images/icons/dot.svg";
import ClockOrange from "@/images/icons/clock-orange.svg";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

type GuestDetailsInterface = {
  toggleMenu: () => void;
  isOpen: boolean;
};

const GuestDetailsModal: React.FC<GuestDetailsInterface> = ({
  toggleMenu,
  isOpen,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggleMenu();
      }}
    >
      <DialogContentBare className="fixed right-0 top-0 bottom-0 left-auto h-full w-fit max-w-none translate-x-0 translate-y-0 gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Guest details</DialogTitle>
        <div className="h-full w-[585px] bg-white p-[48px] px-[20px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-[16px] font-semibold leading-[24px] tracking-custom">
                Guest details
              </p>
            </div>
            <div>
              <CloseIcon className="cursor-pointer" onClick={toggleMenu} />
            </div>
          </div>
          <div className="mt-[40px] p-[24px] px-[64px]">
            <p className="font-sans text-[20px] font-semibold leading-[28px]">
              Halloween party
            </p>
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <p className="font-sans text-[16px] font-normal leading-[27px] tracking-custom text-text-grey">
                Mon, 23 Mar
              </p>
              <DotIcon className="w-1" />
              <p className="font-sans text-[16px] font-normal leading-[27px] tracking-custom text-text-grey">
                4PM
              </p>
              <p className="font-sans text-text-grey">-</p>
              <p className="font-sans text-[16px] font-normal leading-[27px] tracking-custom text-text-grey">
                6PM
              </p>
            </div>
            <div className="mt-[24px]">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <p className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey">
                    Guest name
                  </p>
                  <p className="font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom text-light-black">
                    Christine Joseph
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey">
                    Ticket ID
                  </p>
                  <p className="font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom text-light-black">
                    HP092W2
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[24px]">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <p className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey">
                    Email address
                  </p>
                  <p className="font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom text-light-black">
                    christinejoseph@gmail.com
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey">
                    Ticket type
                  </p>
                  <p className="font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom text-light-black">
                    REGULAR
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[24px]">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <p className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey">
                    Check in status
                  </p>
                  <div className="flex items-center justify-center gap-[4px] rounded-[12px] bg-warning p-[2px] px-[8px]">
                    <ClockOrange />
                    <p className="font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom text-warning-bold">
                      Pending
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey">
                    Checked in
                  </p>
                  <p className="font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom text-light-black">
                    0/1 tickets
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[24px]">
              <button className="h-[48px] w-full rounded-[12px] bg-gradient-green p-[14px] px-[48px] shadow-custom-bottom">
                <p className="font-sans text-[16px] font-semi-normal leading-[19.2px] text-white">
                  Check in
                </p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default GuestDetailsModal;
