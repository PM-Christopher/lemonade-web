import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import { formatDate, formatTime } from "@/lib/dateTimeFormatter";
import { MyTicketSkeleton } from "@/components/Skeletons";

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
    <div
      className={`fixed inset-0 z-50 items-start justify-center bg-white bg-opacity-100 py-[20px] laptop:items-center laptop:bg-gray-800 laptop:bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="max-h-[90vh] w-[480px] overflow-y-auto rounded-lg bg-light_grey p-0 shadow-none laptop:bg-white laptop:p-6 laptop:shadow-lg">
        <div className="mt-10 flex items-center justify-between bg-white p-6 laptop:bg-none laptop:p-0">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={toggle}>
              <CloseIcon />
            </div>
          </div>
        </div>
        {loading ? (
          <MyTicketSkeleton />
        ) : (
          <div className="p-6 laptop:p-0">
            <div className="mt-[16px] flex flex-col items-center rounded-[16px] bg-white p-6 laptop:mt-10 laptop:rounded-none laptop:bg-none laptop:p-0">
              <div className="flex justify-center">
                <div className="flex w-[340px] flex-col gap-[16px]">
                  <p className="font-sans text-[20px] font-semi-normal leading-[21px]">
                    {ticket?.ticket[0]?.event_name}
                  </p>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <p className="text-[14px] font-normal text-text-grey">Date</p>
                      <p className="text-[14px] font-semi-normal">
                        {formatDate(ticket?.ticket[0]?.date)}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-right text-[14px] font-normal text-text-grey">Time</p>
                      <p className="text-right text-[14px] font-semi-normal">
                        {formatTime(ticket?.ticket[0]?.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <p className="text-[14px] font-normal text-text-grey">Ticket type</p>
                      <p className="text-[14px] font-semi-normal">
                        {ticket?.ticket[0]?.ticket_type}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-right text-[14px] font-normal text-text-grey">Ticket ID</p>
                      <p className="text-right text-[14px] font-semi-normal">
                        {ticket?.ticket[0]?.ticket_code}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <p className="text-[14px] font-normal text-text-grey">Venue</p>
                      <p className="text-[14px] font-semi-normal">{ticket?.ticket[0]?.venue}</p>
                    </div>
                  </div>
                  {ticket?.ticket[0]?.qr_code && (
                    <div className="mt-[94px] flex items-center justify-center laptop:mt-[48px]">
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
    </div>
  );
};

export default MyEventModal;
