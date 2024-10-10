import React from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import Image from "next/image";
import event_details_image from "@/image/event_images/details_image.png";
import CalendarIcon from "@/image/icons/calendar-large.svg";
import DotIcon from "@/image/icons/Dot.svg";
import LocationIcon from "@/image/icons/location-large.svg";
import StrikeLine from "@/image/icons/StrikeLine.svg";
import CopyIcon from "@/image/icons/CopyIcon.svg";
import ChevronRight from "@/image/icons/ChevronRight.svg";

const ProgramDetailsPage = () => {
    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-5 px-10 border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft/>
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Program details</p>
                </div>
            </div>

            <section className="min-h-screen mt-4 flex flex-col items-center">
                <div className="flex justify-between gap-[40px]">
                    <div className="w-[640px] p-[24px] rounded-[12px] gap-[24px] bg-white">
                        <div className="bg-green-tint p-[8px] px-[16px] rounded-[8px] flex gap-3 items-center">
                            <Image src={event_details_image} alt="details"/>
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
                        <div className="p-[16px] rounded-[12px] gap-[16px] bg-light-tint mt-[24px] mb-[28px]">
                            <p className="font-semi-normal text-text-grey text-[14px]">Affiliate link</p>
                            <div
                                className="p-[12px] rounded-[12px] gap-[8px] bg-light-tint-3 mt-[8px] flex items-center">
                                <p className="font-semi-normal text-light-black truncate">https://www.lemonade.com/Event_nameID/ref...</p>
                                <StrikeLine/>
                                <CopyIcon/>
                            </div>
                        </div>
                        <div className="flex flex-col p-[16px] rounded-[12px] border-[1px] border-mid-grey">
                            <p className="font-sans font-normal text-text-grey text-[14px]">Total commission</p>
                            <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">N22,000</p>
                            <div className="border-t-mid-grey border-t-[1px] my-[16px]"></div>
                            <p className="font-sans font-normal text-text-grey text-[14px]">Tickets sold</p>
                            <p className="font-sans font-semibold text-[18px] tracking-custom leading-[27px]">300</p>
                        </div>
                    </div>
                    <div>
                        <div className="w-[480px] bg-white p-[16px] rounded-[8px] flex flex-col">
                            <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                                Commissions by ticket type
                            </p>
                            <div>
                                <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">Free</p>
                                <div className="flex justify-between mt-[2px]">
                                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">N0</p>
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">40/∞</p>
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
                                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">N2,000</p>
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">160/2000</p>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                    <div
                                        className="bg-gradient-progress-green h-[8px] rounded-full"
                                        style={{width: "10%"}}></div>
                                </div>
                            </div>
                            <div className="border-t-[1px] border-t-grey-20 mb-[16px] mt-[32px]"></div>
                            <div>
                                <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">VIP</p>
                                <div className="flex justify-between mt-[2px]">
                                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">N20,000</p>
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">100/500</p>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                    <div
                                        className="bg-gradient-progress-green h-[8px] rounded-full"
                                        style={{width: "20%"}}></div>
                                </div>
                            </div>
                        </div>
                        <div className="w-[480px] mt-[24px] bg-white p-[16px] rounded-[8px] flex flex-col">
                            <p className="font-sans font-semibold text-[16px] leading-[24px] tracking-custom">
                                Tickets sold by ticket type
                            </p>
                            <div>
                                <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">Free</p>
                                <div className="flex justify-between mt-[2px]">
                                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">-</p>
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">40/∞</p>
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
                                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">10%</p>
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">160/2000</p>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                    <div
                                        className="bg-gradient-progress-green h-[8px] rounded-full"
                                        style={{width: "10%"}}></div>
                                </div>
                            </div>
                            <div className="border-t-[1px] border-t-grey-20 mb-[16px] mt-[32px]"></div>
                            <div>
                                <p className="font-sans font-normal text-[14px] leading-[16.8px] mt-[16px]">VIP</p>
                                <div className="flex justify-between mt-[2px]">
                                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">20%</p>
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] tracking-custom">100/500</p>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-[8px] mt-[4px]">
                                    <div
                                        className="bg-gradient-progress-green h-[8px] rounded-full"
                                        style={{width: "20%"}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default ProgramDetailsPage;