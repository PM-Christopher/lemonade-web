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
        className={`bg-opacity-50 fixed top-0 right-0 z-50 h-full transform bg-gray-800 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="laptop:w-[585px] h-full w-screen bg-white p-[48px] px-[20px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="tracking-custom font-sans text-[16px] leading-[24px] font-semibold">
                My tickets
              </p>
            </div>
            <div>
              <CloseIcon className="cursor-pointer" onClick={toggleMenu} />
            </div>
          </div>
          <div className="border-b-light-grey-50 mt-[10px] flex justify-between border-b-[1px]">
            <div
              className={`laptop:w-[276.5px] h-10 w-full px-[16px] py-[8px] ${option === "upcoming" && "border-b-step-color border-b-2"}`}
            >
              <p
                className="font-semi-normal tracking-custom cursor-pointer text-center font-sans text-[14px] leading-[21px]"
                onClick={() => toggleOption("upcoming")}
              >
                Upcoming events
              </p>
            </div>
            <div
              className={`laptop:w-[276.5px] h-10 w-full px-[16px] py-[8px] ${option === "past" && "border-b-step-color border-b-2"}`}
            >
              <p
                className="font-semi-normal tracking-custom cursor-pointer text-center font-sans text-[14px] leading-[21px]"
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
            isOpen ? "bg-opacity-50 bg-black backdrop-blur-sm" : "bg-transparent"
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
