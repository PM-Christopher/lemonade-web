import React from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import event_details_image from "@/image/event_images/details_image.png"
import Image from "next/image";
import CalendarIcon from "@/image/icons/calendar-large.svg";
import LocationIcon from "@/image/icons/location-large.svg";
import DotIcon from "@/image/icons/Dot.svg"
import MicIcon from "@/image/icons/microphone.svg"
import QrIcon from "@/image/icons/qr_code.svg"
import EditIcon from "@/image/icons/EditIconBlack.svg"
import TicketIcon from "@/image/icons/ticket.svg"
import ChevronRightIcon from "@/image/icons/ChevronRight.svg"
import AffiliateUsersIcon from "@/image/icons/affiliate_users.svg"

const EventDetailsPage = () => {
    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft/>
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Event details</p>
                </div>
            </div>
            <div className="min-h-screen mt-4 flex flex-col items-center">
                <div className="flex justify-between gap-[24px]">
                    <div className="w-[640px] p-[24px] rounded-[12px] bg-white flex flex-col">
                        <div className="bg-green-tint p-[8px] px-[16px] rounded-[8px] flex gap-3 items-center">
                            <Image src={event_details_image} alt="details" />
                            <div className="flex flex-col">
                                <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">Halloween party</p>
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
                                <div className="flex items-center gap-2">
                                    <LocationIcon/>
                                    <p className="font-sans font-normal text-[16px] leading-[27px] text-text-grey">Lekki
                                        phase 1</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center mt-[24px] gap-8">
                            <div className="flex flex-col items-center gap-[8px]">
                                <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                                    <MicIcon/>
                                </div>
                                <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Promote</p>
                            </div>
                            <div className="flex flex-col items-center gap-[8px]">
                                <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                                    <QrIcon/>
                                </div>
                                <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Check in</p>
                            </div>
                            <div className="flex flex-col items-center gap-[8px]">
                                <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                                    <EditIcon />
                                </div>
                                <div>
                                    <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Edit
                                        event</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-[8px]">
                                <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                                    <TicketIcon/>
                                </div>
                                <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Add ticket</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-[12px] px-[16px] border-[1px] rounded-[12px] border-mid-grey mt-[24px]">
                            <div className="flex items-center gap-2">
                                <AffiliateUsersIcon />
                                <p className="font-sans font-semi-normal text-[16px] leading-[24px] tracking-custom">Guest list</p>
                            </div>
                            <ChevronRightIcon />
                        </div>
                    </div>
                    <div className="w-[480px] bg-white p-[4px] rounded-[12px]"></div>
                </div>
            </div>
        </section>
    );
}

export default EventDetailsPage;