"use client"
import React, {useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import SideMenuEventCard from "@/components/events/SideMenuEventCard";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {MyTicketInterface} from "@/interfaces/EventInterface";
import MyEventModal from "@/components/events/Modals/MyEventModal";

type SideMenuInterface = {
    toggleMenu: () => void,
    isOpen: boolean
}

// type MyEventProps = {
//     event_name:
// }

const SideMenu: React.FC<SideMenuInterface> = ({toggleMenu, isOpen}) => {
    const [option, setOption] = useState("upcoming")
    const [myEventSelected, setMyEventSelected] = useState(null)
    const [myEvent, setMyEvent] = useState(false)
    const [ticket, setTicket] = useState({})
    const [ticketId, setTicketId] = useState<number | null>()

    const toggleOption = (option: string) => {
        setOption(option)
    }

    const toggleEventID = (id: number) => {
        setMyEvent(!myEvent)
        setTicketId(id)
    }

    const toggleMyEvent = () => {
        setMyEvent(!myEvent)
    }

    const url = ticketId ? `/user/events/attendees/my-ticket/${ticketId}` : null
    const {data: ticketData, loading: ticketLoading} = useRequest(url as any)
    const {data, loading} = useRequest(`/user/events/attendees/my-tickets`)

    return (
        <>
            <div
                className={`fixed top-0 right-0 z-50 bg-gray-800 bg-opacity-50 h-full transform transition-transform ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="w-screen laptop:w-[585px] h-full bg-white p-[48px] px-[20px]">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">My
                                tickets</p>
                        </div>
                        <div>
                            <CloseIcon className="cursor-pointer" onClick={toggleMenu}/>
                        </div>
                    </div>
                    <div className="flex justify-between mt-[10px] border-b-[1px] border-b-light-grey-50">
                        <div
                            className={`h-10 w-full laptop:w-[276.5px] py-[8px] px-[16px] ${option === 'upcoming' && 'border-b-step-color border-b-2'}`}>
                            <p className="text-center font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom cursor-pointer"
                               onClick={() => toggleOption("upcoming")}>
                                Upcoming events
                            </p>
                        </div>
                        <div
                            className={`h-10 w-full laptop:w-[276.5px] py-[8px] px-[16px] ${option === 'past' && 'border-b-step-color border-b-2'}`}>
                            <p className="text-center font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom cursor-pointer"
                               onClick={() => toggleOption("past")}>Past events</p>
                        </div>
                    </div>

                    <div
                        className="flex flex-col w-full gap-[12px] overflow-y-auto max-h-screen hide-scrollbar">
                        {
                            option === "upcoming" ? (
                                data?.upcoming.length > 0 ? (
                                    data?.upcoming.map((event: MyTicketInterface, index: number) => (
                                        <SideMenuEventCard ticket_id={event.id} event={event.event} key={index}
                                                           toggle={toggleEventID}/>
                                    ))
                                ) : (
                                    <div className="mt-[10px]">
                                        <p className="font-semiBold">No event listed</p>
                                    </div>
                                )
                            ) : (
                                data?.past.length > 0 ? (
                                    data?.past.map((event: MyTicketInterface, index: number) => (
                                        <SideMenuEventCard ticket_id={event.id} event={event.event} key={index}
                                                           toggle={toggleEventID}/>
                                    ))
                                ) : (
                                    <div className="mt-[10px]">
                                        <p className="font-semiBold">No event listed</p>
                                    </div>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
            {
                isOpen && (
                    <div
                        className={`fixed z-10 inset-0 transition-all duration-300 ${
                            isOpen ? 'bg-black bg-opacity-50 backdrop-blur-sm' : 'bg-transparent'
                        }`}
                        onClick={toggleMenu}
                    ></div>
                )
            }
            <MyEventModal ticket={ticketData} loading={ticketLoading} toggle={toggleMyEvent} isOpen={myEvent}/>
        </>
    );
}

export default SideMenu;