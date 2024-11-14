import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import {formatDate, formatTime} from "@/lib/dateTimeFormatter";

const MyEventModal = ({toggle, isOpen, ticket, loading}: {toggle: () => void, isOpen: boolean, ticket: any, loading: boolean}) => {
    return (
        <div
            className={`fixed inset-0 bg-white laptop:bg-gray-800  bg-opacity-100 laptop:bg-opacity-50 items-start laptop:items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-light_grey laptop:bg-white rounded-lg shadow-none laptop:shadow-lg w-[480px] p-0 laptop:p-6 min-h-screen">
                <div className="flex justify-between items-center mt-10 p-6 laptop:p-0 bg-white laptop:bg-none">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon/>
                        </div>
                    </div>
                </div>
                <div className="p-6 laptop:p-0">
                    <div
                        className="flex flex-col items-center mt-[16px] laptop:mt-10 bg-white laptop:bg-none p-6 laptop:p-0 rounded-[16px] laptop:rounded-none">
                        <div className="flex justify-center">
                            <div
                                className="w-[340px] flex flex-col gap-[16px]">
                                <p className="font-sans font-semi-normal text-[20px] leading-[21px]">
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
                                        <p className="text-text-grey text-[14px] font-normal text-right">Time</p>
                                        <p className="font-semi-normal text-[14px] text-right">
                                            {formatTime(ticket?.ticket[0]?.date)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-text-grey text-[14px] font-normal">Ticket type</p>
                                        <p className="font-semi-normal text-[14px]">{ticket?.ticket[0]?.ticket_type}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-right text-text-grey text-[14px] font-normal">Ticket ID</p>
                                        <p className="text-right font-semi-normal text-[14px]">{ticket?.ticket[0]?.ticket_code}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-text-grey text-[14px] font-normal">Venue</p>
                                        <p className="font-semi-normal text-[14px]">{ticket?.ticket[0]?.venue}</p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center mt-[94px] laptop:mt-0">
                                    <Image src={"/images/qrCode.png"} alt="qr_code" width={240} height={240}/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyEventModal;