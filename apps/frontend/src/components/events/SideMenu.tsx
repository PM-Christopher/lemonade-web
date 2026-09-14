"use client";
import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import SideMenuEventCard from "@/components/events/SideMenuEventCard";
import { MyTicketInterface } from "@/interfaces/EventInterface";
import MyEventModal from "@/components/events/Modals/MyEventModal";
import { useMyTicketsQuery, useMyTicketQuery } from "@/features/events/queries";

type SideMenuInterface = {
  toggleMenu: () => void;
  isOpen: boolean;
};

// type MyEventProps = {
//     event_name:
// }

const SideMenu: React.FC<SideMenuInterface> = ({ toggleMenu, isOpen }) => {
  const [option, setOption] = useState("upcoming");
  const [myEventSelected, setMyEventSelected] = useState(null);
  const [myEvent, setMyEvent] = useState(false);
  const [ticket, setTicket] = useState({});
  const [ticketId, setTicketId] = useState<number | null>();

  const toggleOption = (option: string) => {
    setOption(option);
  };

  const toggleEventID = (id: number) => {
    setMyEvent(!myEvent);
    setTicketId(id);
  };

  const toggleMyEvent = () => {
    setMyEvent(!myEvent);
  };

  const { data: ticketData, isLoading: ticketLoading } = useMyTicketQuery(ticketId ?? undefined);
  const { data } = useMyTicketsQuery();

  return (
    <>
      <div
        className={`fixed right-0 top-0 z-50 h-full transform bg-gray-800 bg-opacity-50 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full w-screen bg-white p-[48px] px-[20px] laptop:w-[585px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-[16px] font-semibold leading-[24px] tracking-custom">
                My tickets
              </p>
            </div>
            <div>
              <CloseIcon className="cursor-pointer" onClick={toggleMenu} />
            </div>
          </div>
          <div className="mt-[10px] flex justify-between border-b-[1px] border-b-light-grey-50">
            <div
              className={`h-10 w-full px-[16px] py-[8px] laptop:w-[276.5px] ${option === "upcoming" && "border-b-2 border-b-step-color"}`}
            >
              <p
                className="cursor-pointer text-center font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom"
                onClick={() => toggleOption("upcoming")}
              >
                Upcoming events
              </p>
            </div>
            <div
              className={`h-10 w-full px-[16px] py-[8px] laptop:w-[276.5px] ${option === "past" && "border-b-2 border-b-step-color"}`}
            >
              <p
                className="cursor-pointer text-center font-sans text-[14px] font-semi-normal leading-[21px] tracking-custom"
                onClick={() => toggleOption("past")}
              >
                Past events
              </p>
            </div>
          </div>

          <div className="hide-scrollbar flex max-h-screen w-full flex-col gap-[12px] overflow-y-auto">
            {option === "upcoming" ? (
              (data?.upcoming?.length ?? 0) > 0 ? (
                data?.upcoming?.map((event: MyTicketInterface, index: number) => (
                  <SideMenuEventCard
                    ticket_id={event.id}
                    event={event.event}
                    key={index}
                    toggle={toggleEventID}
                  />
                ))
              ) : (
                <div className="mt-[10px]">
                  <p className="font-semiBold">No event listed</p>
                </div>
              )
            ) : (data?.past?.length ?? 0) > 0 ? (
              data?.past?.map((event: MyTicketInterface, index: number) => (
                <SideMenuEventCard
                  ticket_id={event.id}
                  event={event.event}
                  key={index}
                  toggle={toggleEventID}
                />
              ))
            ) : (
              <div className="mt-[10px]">
                <p className="font-semiBold">No event listed</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className={`fixed inset-0 z-10 transition-all duration-300 ${
            isOpen ? "bg-black bg-opacity-50 backdrop-blur-sm" : "bg-transparent"
          }`}
          onClick={toggleMenu}
        ></div>
      )}
      <MyEventModal
        ticket={ticketData}
        loading={ticketLoading}
        toggle={toggleMyEvent}
        isOpen={myEvent}
      />
    </>
  );
};

export default SideMenu;
