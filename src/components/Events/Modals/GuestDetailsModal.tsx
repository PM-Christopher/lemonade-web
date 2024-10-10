import React from 'react';
import CloseIcon from "@/image/icons/close.svg";
import CalendarIcon from "@/image/icons/calendar-large.svg";
import DotIcon from "@/image/icons/Dot.svg";
import ClockOrange from "@/image/icons/clock-orange.svg";

type GuestDetailsInterface = {
    toggleMenu: () => void,
    isOpen: boolean
}

const GuestDetailsModal: React.FC<GuestDetailsInterface> = ({toggleMenu, isOpen}) => {
    return (
        <>
            <div
                className={`fixed top-0 right-0 z-50 bg-gray-800 bg-opacity-50 h-full transform transition-transform ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="w-[585px] h-full bg-white p-[48px] px-[20px]">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">Guest details</p>
                        </div>
                        <div>
                            <CloseIcon className="cursor-pointer" onClick={toggleMenu} />
                        </div>
                    </div>
                    <div className="p-[24px] px-[64px] mt-[40px]">
                        <p className="font-sans font-semibold text-[20px] leading-[28px]">Halloween party</p>
                        <div className="flex items-center gap-2">
                            <CalendarIcon/>
                            <p className="font-sans font-normal text-[16px] leading-[27px] tracking-custom text-text-grey">Mon,
                                23
                                Mar</p>
                            <DotIcon className="w-1"/>
                            <p className="font-sans font-normal text-[16px] leading-[27px] tracking-custom text-text-grey">4PM</p>
                            <p className="font-sans text-text-grey">-</p>
                            <p className="font-sans font-normal text-[16px] leading-[27px] tracking-custom text-text-grey">6PM</p>
                        </div>
                        <div className="mt-[24px]">
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Guest
                                        name</p>
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom text-light-black">Christine
                                        Joseph</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Ticket
                                        ID</p>
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom text-light-black">HP092W2</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-[24px]">
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Email
                                        address</p>
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom text-light-black">christinejoseph@gmail.com</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Ticket
                                        type</p>
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom text-light-black">REGULAR</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-[24px]">
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Check in status</p>
                                    <div className="bg-warning rounded-[12px] p-[2px] px-[8px] flex items-center gap-[4px] justify-center">
                                        <ClockOrange />
                                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom text-warning-bold">Pending</p>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Checked in</p>
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom text-light-black">0/1 tickets</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-[24px]">
                            <button className="h-[48px] bg-gradient-green p-[14px] px-[48px] shadow-custom-bottom w-full rounded-[12px]">
                                <p className="font-sans font-semi-normal text-[16px] text-white leading-[19.2px]">Check in</p>
                            </button>
                        </div>
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
        </>
    );
}

export default GuestDetailsModal;