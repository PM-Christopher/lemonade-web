import React from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import Image from "next/image";
import vertical_image from "@/image/event_images/vertical_poster.png"
import CalendarIcon from "@/image/icons/calendar.svg";
import ClockIcon from "@/image/icons/clock.svg";
import PlusIcon from "@/image/icons/Plus.svg"
import MinusIcon from "@/image/icons/Minus.svg"
import {Button} from "@/components/ui/button";

function Page() {
    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-[12px] px-10 border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft />
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Buy ticket</p>
                </div>
            </div>
            <section className="min-h-screen mt-4">
                <div className="flex justify-around">
                    <div>
                        <div className="bg-white w-[688px] p-[24px] rounded-[12px]">
                            <div className="bg-green-tint flex gap-2 p-[12px] px-[16px] rounded-[8px]">
                                <Image src={vertical_image} alt="poster"/>
                                <div>
                                    <p className="font-sans font-semi-normal text-[18px] leading-[27px] text-black-light">Unlocking
                                        business potentials</p>
                                    <div className="flex items-center gap-2 mt-[4px]">
                                        <CalendarIcon/>
                                        <p className="font-sans font-normal text-[16px] leading-[24px] tracking-custom text-text-grey">Mon,
                                            23
                                            Mar</p>
                                        <p>-</p>
                                        <p className="font-sans font-normal text-[16px] leading-[24px] tracking-custom text-text-grey">Mon,
                                            23
                                            Mar</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-[4px]">
                                        <ClockIcon/>
                                        <p className="font-sans font-normal text-[16px] leading-[24px] text-text-grey">04:00PM</p>
                                        <p>-</p>
                                        <p className="font-sans font-normal text-[16px] leading-[24px] text-text-grey">11:00PM</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between mt-[24px] items-center">
                                <div className="flex flex-col">
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-black-light">Regular</p>
                                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">₦2,000</p>
                                    <p className="font-sans font-normal text-[12px] leading-[14.4px] text-text-grey">Benefits
                                        of regular</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div
                                        className="p-3 rounded-[8px] bg-light-white w-[24px] h-[24px] flex items-center justify-center">
                                        <p className="">-</p>
                                    </div>
                                    <div
                                        className="p-4 rounded-[8px] bg-light-white w-[27.75px] h-[28px] flex items-center justify-center">
                                        <p className="text-[16px] font-sans font-semi-normal leading-[24px] tracking-custom">1</p>
                                    </div>
                                    <div
                                        className="p-3 rounded-[8px] bg-light-white w-[24px] h-[24px] flex items-center justify-center">
                                        <p className="">+</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t-[1px] border-grey-20 my-2"></div>
                            <div className="flex justify-between mt-[24px] items-center">
                                <div className="flex flex-col">
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-black-light">VIP</p>
                                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">₦2,000</p>
                                    <p className="font-sans font-normal text-[12px] leading-[14.4px] text-text-grey">Benefits
                                        of regular</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div
                                        className="p-3 rounded-[8px] bg-light-white w-[24px] h-[24px] flex items-center justify-center">
                                        <p className="">-</p>
                                    </div>
                                    <div
                                        className="p-4 rounded-[8px] bg-light-white w-[27.75px] h-[28px] flex items-center justify-center">
                                        <p className="text-[16px] font-sans font-semi-normal leading-[24px] tracking-custom">1</p>
                                    </div>
                                    <div
                                        className="p-3 rounded-[8px] bg-light-white w-[24px] h-[24px] flex items-center justify-center">
                                        <p className="">+</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t-[1px] border-grey-20 my-2"></div>
                            <div className="flex justify-between mt-[24px] items-center">
                                <div className="flex flex-col">
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-black-light">Executive</p>
                                    <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">₦2,000</p>
                                    <p className="font-sans font-normal text-[12px] leading-[14.4px] text-text-grey">Benefits
                                        of regular</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div
                                        className="p-3 rounded-[8px] bg-light-white w-[24px] h-[24px] flex items-center justify-center">
                                        <p className="">-</p>
                                    </div>
                                    <div
                                        className="p-4 rounded-[8px] bg-light-white w-[27.75px] h-[28px] flex items-center justify-center">
                                        <p className="text-[16px] font-sans font-semi-normal leading-[24px] tracking-custom">1</p>
                                    </div>
                                    <div
                                        className="p-3 rounded-[8px] bg-light-white w-[24px] h-[24px] flex items-center justify-center">
                                        <p className="">+</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t-[1px] border-grey-20 my-2"></div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white w-[480px] px-[10px] py-[12px] rounded-[12px]">
                            <p className="font-sans font-semibold text-[20px] leading-[28px]">Summary</p>
                            <div className="flex justify-between mt-[16px]">
                                <div>
                                    <p className="font-sans font-normal text-text-grey tracking-custom leading-[21px] text-[14px]">2
                                        Regular</p>
                                </div>
                                <div>
                                    <p className="font-sans font-semibold text-light-black tracking-custom leading-[21px] text-[14px]">₦2,000</p>
                                </div>
                            </div>
                            <div className="flex justify-between mt-[16px]">
                                <div>
                                    <p className="font-sans font-normal text-text-grey tracking-custom leading-[21px] text-[14px]">2
                                        Regular</p>
                                </div>
                                <div>
                                    <p className="font-sans font-semibold text-light-black tracking-custom leading-[21px] text-[14px]">₦2,000</p>
                                </div>
                            </div>
                            <div className="border-t-[1px] border-grey-20 my-4"></div>
                            <div className="flex justify-between mt-[16px]">
                                <div>
                                    <p className="font-sans font-normal text-text-grey tracking-custom leading-[21px] text-[14px]">Subtotal</p>
                                </div>
                                <div>
                                    <p className="font-sans font-semibold text-light-black tracking-custom leading-[21px] text-[14px]">₦2,000</p>
                                </div>
                            </div>
                            <div className="flex justify-between mt-[16px]">
                                <div>
                                    <p className="font-sans font-normal text-text-grey tracking-custom leading-[21px] text-[14px]">Fee</p>
                                </div>
                                <div>
                                    <p className="font-sans font-semibold text-light-black tracking-custom leading-[21px] text-[14px]">₦2,000</p>
                                </div>
                            </div>
                            <div className="border-t-[1px] border-grey-20 my-4"></div>
                            <div className="flex justify-between mt-[16px]">
                                <div>
                                    <p className="font-sans font-normal text-text-grey tracking-custom leading-[27px] text-[18px]">Total</p>
                                </div>
                                <div>
                                    <p className="font-sans font-semibold text-light-black tracking-custom leading-[27px] text-[18px]">₦12,000</p>
                                </div>
                            </div>
                            <div className="flex justify-between mt-[20px] items-center">
                                <div>
                                    <p className="font-sans font-normal text-text-grey tracking-custom leading-[27px] text-[18px] pl-[40px]">-</p>
                                </div>
                                <div>
                                    <Button
                                        className={"bg-gradient-green w-[216px] h-[48px] py-[14px] px-[48px] gap-[8px] rounded-[12px] border-b-2 border-transparent shadow-custom-top shadow-custom-bottom"}>
                                        <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">Assign ticket</p>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default Page;