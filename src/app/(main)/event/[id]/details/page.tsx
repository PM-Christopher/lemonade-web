"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import CalendarIcon from "@/images/icons/calendar-large.svg";
import LocationIcon from "@/images/icons/location-large.svg";
import DotIcon from "@/images/icons/dot.svg"
import MicIcon from "@/images/icons/microphone.svg"
import QrIcon from "@/images/icons/qr_code.svg"
import EditIcon from "@/images/icons/editIconBlack.svg"
import TicketIcon from "@/images/icons/ticket.svg"
import ChevronRightIcon from "@/images/icons/chevronRight.svg"
import AffiliateUsersIcon from "@/images/icons/affiliate_users.svg"
import PaymentSuccessfulModal from "@/components/Events/Modals/PaymentSuccessfulModal";
import PromotionDetailsModal from "@/components/Events/Modals/PromotionDetailsModal";
import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";

const EventDetailsPage = () => {
    const [isOpen, setIsOpen]  = useState(false)
    const [isDetailsOpen, setIsDetailsOpen]  = useState(false)

    const activateModal = () => {
        setIsOpen(!isOpen)
    }

    const activateDetailsModal = () => {
        setIsDetailsOpen(!isDetailsOpen)
    }
    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <TopNav/>
                <div
                    className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Event details</p>
                    </div>
                </div>
                <div className="mt-4 flex flex-col items-center">
                    <div className="flex justify-between gap-[24px]">
                        <div>
                            <div className="w-[640px] p-[24px] rounded-[12px] bg-white flex flex-col">
                                <div className="bg-green-tint p-[8px] px-[16px] rounded-[8px] flex gap-3 items-center">
                                    <Image src={"/images/event_images/details_image.png"} alt="details" width={120} height={120}/>
                                    <div className="flex flex-col">
                                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">Halloween
                                            party</p>
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
                                    <Link href={"/event/5/promote-event"}>
                                        <div className="flex flex-col items-center gap-[8px]">
                                            <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                                                <MicIcon/>
                                            </div>
                                            <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Promote</p>
                                        </div>
                                    </Link>
                                    <Link href={"/"}>
                                        <div className="flex flex-col items-center gap-[8px]">
                                            <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                                                <QrIcon/>
                                            </div>
                                            <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Check
                                                in</p>
                                        </div>
                                    </Link>
                                    <Link href={"/"}>
                                        <div className="flex flex-col items-center gap-[8px]">
                                            <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                                                <EditIcon/>
                                            </div>
                                            <div>
                                                <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Edit
                                                    event</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link href={"/"}>
                                        <div className="flex flex-col items-center gap-[8px]">
                                            <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px]">
                                                <TicketIcon/>
                                            </div>
                                            <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Add
                                                ticket</p>
                                        </div>
                                    </Link>
                                </div>
                                <Link href={"/event/5/guest-list"}>
                                    <div
                                        className="flex justify-between items-center p-[12px] px-[16px] border-[2px] rounded-[12px] border-mid-grey mt-[24px]">
                                        <div className="flex items-center gap-2">
                                            <AffiliateUsersIcon/>
                                            <p className="font-sans font-semi-normal text-[16px] leading-[24px] tracking-custom">Guest
                                                list</p>
                                        </div>
                                        <ChevronRightIcon/>
                                    </div>
                                </Link>
                                <div
                                    className="flex flex-col p-[16px] border-[2px] rounded-[12px] border-mid-grey mt-[24px]">
                                    <div className="flex flex-col">
                                        <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Sales
                                            Revenue</p>
                                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom text-black-light">₦2,000</p>
                                    </div>
                                    <div className="border-t-[1px] border-t-grey-20 my-4"></div>
                                    <div className="flex flex-col">
                                        <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Tickets
                                            sold</p>
                                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom text-black-light">0/2000</p>
                                    </div>
                                    <div className="border-t-[1px] border-t-grey-20 my-4"></div>
                                    <div className="flex flex-col">
                                        <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Check
                                            ins</p>
                                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom text-black-light">0% <span
                                            className="font-normal">(0/0)</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="w-[480px] bg-white p-[16px] rounded-[8px] flex flex-col">
                                <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                                    Sales revenue by ticket type
                                </p>
                                <div>
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">Free</p>
                                    <div className="flex justify-between mt-[2px]">
                                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">₦2,000</p>
                                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">2/∞</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                        <div
                                            className="bg-gradient-progress-green h-[8px] rounded-full"
                                            style={{width: "100%"}}></div>
                                    </div>
                                </div>
                                <div className="border-t-[1px] border-t-grey-20 mb-[16px] mt-[32px]"></div>
                                <div>
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">Regular</p>
                                    <div className="flex justify-between mt-[2px]">
                                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">₦2,000</p>
                                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">2/3000</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                        <div
                                            className="bg-gradient-progress-green h-[8px] rounded-full"
                                            style={{width: "10%"}}></div>
                                    </div>
                                </div>
                                <div className="border-t-[1px] border-t-grey-20 mb-[16px] mt-[32px]"></div>
                                <div>
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">Gold</p>
                                    <div className="flex justify-between mt-[2px]">
                                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">₦20,000</p>
                                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">2/200</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                        <div
                                            className="bg-gradient-progress-green h-[8px] rounded-full"
                                            style={{width: "20%"}}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[480px] bg-white p-[16px] rounded-[8px] flex flex-col">
                                <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                                    Ticket sold by ticket type
                                </p>
                                <div>
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">Free</p>
                                    <div className="flex justify-between mt-[2px]">
                                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">-</p>
                                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">2/∞</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                        <div
                                            className="bg-gradient-progress-green h-[8px] rounded-full"
                                            style={{width: "100%"}}></div>
                                    </div>
                                </div>
                                <div className="border-t-[1px] border-t-grey-20 mb-[16px] mt-[32px]"></div>
                                <div>
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">Regular</p>
                                    <div className="flex justify-between mt-[2px]">
                                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">30%</p>
                                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">300/3000</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                        <div
                                            className="bg-gradient-progress-green h-[8px] rounded-full"
                                            style={{width: "30%"}}></div>
                                    </div>
                                </div>
                                <div className="border-t-[1px] border-t-grey-20 mb-[16px] mt-[32px]"></div>
                                <div>
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">Gold</p>
                                    <div className="flex justify-between mt-[2px]">
                                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">50%</p>
                                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">100/200</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                        <div
                                            className="bg-gradient-progress-green h-[8px] rounded-full"
                                            style={{width: "50%"}}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[480px] bg-white p-[16px] rounded-[8px] flex flex-col">
                                <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                                    Check ins by ticket type
                                </p>
                                <div>
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">Free</p>
                                    <div className="flex justify-between mt-[2px]">
                                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">1%</p>
                                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">2/∞</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                        <div
                                            className="bg-gradient-progress-green h-[8px] rounded-full"
                                            style={{width: "10%"}}></div>
                                    </div>
                                </div>
                                <div className="border-t-[1px] border-t-grey-20 mb-[16px] mt-[32px]"></div>
                                <div>
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">Regular</p>
                                    <div className="flex justify-between mt-[2px]">
                                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">30%</p>
                                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">2/3000</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                        <div
                                            className="bg-gradient-progress-green h-[8px] rounded-full"
                                            style={{width: "30%"}}></div>
                                    </div>
                                </div>
                                <div className="border-t-[1px] border-t-grey-20 mb-[16px] mt-[32px]"></div>
                                <div>
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">Gold</p>
                                    <div className="flex justify-between mt-[2px]">
                                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">50%</p>
                                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">100/200</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                        <div
                                            className="bg-gradient-progress-green h-[8px] rounded-full"
                                            style={{width: "50%"}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <PaymentSuccessfulModal toggle={activateModal} isOpen={isOpen}/>
                <PromotionDetailsModal toggle={activateDetailsModal} isOpen={isDetailsOpen}/>
            </section>
        </MainLayout>
    );
}

export default EventDetailsPage;