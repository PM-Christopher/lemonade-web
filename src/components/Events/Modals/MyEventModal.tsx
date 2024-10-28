import React from 'react';
import CloseIcon from "@/image/icons/close.svg";
import QRCode from "@/image/QRCode.png"
import Image from "next/image";
import {EventTicketInterface} from "@/interfaces/EventInterface";
import {formatDate, formatTime} from "@/lib/dateTimeFormatter";

const MyEventModal = ({toggle, isOpen, ticket, loading}: {toggle: () => void, isOpen: boolean, ticket: any, loading: boolean}) => {
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[480px] p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-10">
                    <div className="flex justify-center">
                        <div
                            className="w-[340px] flex flex-col">
                            <p className="font-sans font-semi-normal text-[20px] leading-[21px]">
                                {ticket?.ticket[0]?.event_name}
                            </p>
                            <div className="flex justify-between mt-[16px]">
                                <div className="flex flex-col">
                                    <p className="text-text-grey text-[14px] font-normal">Date</p>
                                    <p className="font-semi-normal text-[14px]">
                                        {formatDate(ticket?.ticket[0]?.date)}
                                    </p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-text-grey text-[14px] font-normal text-right">Time</p>
                                    <p className="font-semi-normal text-[14px] text-right">
                                        {formatTime(ticket?.ticket[0]?.date)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between mt-[16px]">
                                <div className="flex flex-col">
                                    <p className="text-text-grey text-[14px] font-normal">Ticket type</p>
                                    <p className="font-semi-normal text-[14px]">{ticket?.ticket[0]?.ticket_type}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-right text-text-grey text-[14px] font-normal">Ticket ID</p>
                                    <p className="text-right font-semi-normal text-[14px]">{ticket?.ticket[0]?.ticket_code}</p>
                                </div>
                            </div>
                            <div className="flex justify-between mt-[16px]">
                                <div className="flex flex-col">
                                    <p className="text-text-grey text-[14px] font-normal">Venue</p>
                                    <p className="font-semi-normal text-[14px]">{ticket?.ticket[0]?.venue}</p>
                                </div>
                            </div>
                            <div className="flex justify-center items-center">
                                <Image src={QRCode} alt="qr_code" width={240} height={240} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MyEventModal;