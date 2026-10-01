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

const GuestDetailsModal: React.FC<GuestDetailsInterface> = ({ toggleMenu, isOpen }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggleMenu();
      }}
    >
      <DialogContentBare className="fixed top-0 right-0 bottom-0 left-auto h-full w-fit max-w-none translate-x-0 translate-y-0 gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Guest details</DialogTitle>
        <div className="h-full w-[585px] bg-white p-[48px] px-[20px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="tracking-custom font-sans text-[16px] leading-[24px] font-semibold">
                Guest details
              </p>
            </div>
            <div>
              <CloseIcon className="cursor-pointer" onClick={toggleMenu} />
            </div>
          </div>
          <div className="mt-[40px] p-[24px] px-[64px]">
            <p className="font-sans text-[20px] leading-[28px] font-semibold">Halloween party</p>
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <p className="tracking-custom text-text-grey font-sans text-[16px] leading-[27px] font-normal">
                Mon, 23 Mar
              </p>
              <DotIcon className="w-1" />
              <p className="tracking-custom text-text-grey font-sans text-[16px] leading-[27px] font-normal">
                4PM
              </p>
              <p className="text-text-grey font-sans">-</p>
              <p className="tracking-custom text-text-grey font-sans text-[16px] leading-[27px] font-normal">
                6PM
              </p>
            </div>
            <div className="mt-[24px]">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <p className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal">
                    Guest name
                  </p>
                  <p className="font-semi-normal tracking-custom text-light-black font-sans text-[14px] leading-[21px]">
                    Christine Joseph
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal">
                    Ticket ID
                  </p>
                  <p className="font-semi-normal tracking-custom text-light-black font-sans text-[14px] leading-[21px]">
                    HP092W2
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[24px]">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <p className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal">
                    Email address
                  </p>
                  <p className="font-semi-normal tracking-custom text-light-black font-sans text-[14px] leading-[21px]">
                    christinejoseph@gmail.com
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal">
                    Ticket type
                  </p>
                  <p className="font-semi-normal tracking-custom text-light-black font-sans text-[14px] leading-[21px]">
                    REGULAR
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[24px]">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <p className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal">
                    Check in status
                  </p>
                  <div className="bg-warning flex items-center justify-center gap-[4px] rounded-[12px] p-[2px] px-[8px]">
                    <ClockOrange />
                    <p className="font-semi-normal tracking-custom text-warning-bold font-sans text-[14px] leading-[21px]">
                      Pending
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal">
                    Checked in
                  </p>
                  <p className="font-semi-normal tracking-custom text-light-black font-sans text-[14px] leading-[21px]">
                    0/1 tickets
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[24px]">
              <button className="bg-gradient-green shadow-custom-bottom h-[48px] w-full rounded-[12px] p-[14px] px-[48px]">
                <p className="font-semi-normal font-sans text-[16px] leading-[19.2px] text-white">
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
