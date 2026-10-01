import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import { formatDate, formatTime } from "@/lib/dateTimeFormatter";
import { MyTicketSkeleton } from "@/components/Skeletons";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

const MyEventModal = ({
  toggle,
  isOpen,
  ticket,
  loading,
}: {
  toggle: () => void;
  isOpen: boolean;
  ticket: any;
  loading: boolean;
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">
          {ticket?.ticket?.[0]?.event_name || "My ticket"}
        </DialogTitle>
        <div className="bg-light_grey laptop:bg-white laptop:p-6 laptop:shadow-lg max-h-[90vh] w-[480px] overflow-y-auto rounded-lg p-0 shadow-none">
          <div className="laptop:bg-none laptop:p-0 mt-10 flex items-center justify-between bg-white p-6">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
            </div>
          </div>
          {loading ? (
            <MyTicketSkeleton />
          ) : (
            <div className="laptop:p-0 p-6">
              <div className="laptop:mt-10 laptop:rounded-none laptop:bg-none laptop:p-0 mt-4 flex flex-col items-center rounded-2xl bg-white p-6">
                <div className="flex justify-center">
                  <div className="flex w-[340px] flex-col gap-4">
                    <p className="font-semi-normal font-sans text-[20px] leading-[21px]">
                      {ticket?.ticket[0]?.event_name}
                    </p>
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <p className="text-text-grey text-[14px] font-normal">Date</p>
                        <p className="font-semi-normal text-[14px]">
                          {formatDate(ticket?.ticket[0]?.date)}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-text-grey text-right text-[14px] font-normal">Time</p>
                        <p className="font-semi-normal text-right text-[14px]">
                          {formatTime(ticket?.ticket[0]?.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <p className="text-text-grey text-[14px] font-normal">Ticket type</p>
                        <p className="font-semi-normal text-[14px]">
                          {ticket?.ticket[0]?.ticket_type}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-text-grey text-right text-[14px] font-normal">
                          Ticket ID
                        </p>
                        <p className="font-semi-normal text-right text-[14px]">
                          {ticket?.ticket[0]?.ticket_code}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <p className="text-text-grey text-[14px] font-normal">Venue</p>
                        <p className="font-semi-normal text-[14px]">{ticket?.ticket[0]?.venue}</p>
                      </div>
                    </div>
                    {ticket?.ticket[0]?.qr_code && (
                      <div className="laptop:mt-12 mt-[94px] flex items-center justify-center">
                        <Image
                          src={ticket.ticket[0].qr_code}
                          alt="qr_code"
                          width={240}
                          height={240}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default MyEventModal;
