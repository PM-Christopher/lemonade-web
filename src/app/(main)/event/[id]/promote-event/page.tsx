"use client"
import React from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import ChevronRightFilled from "@/images/icons/chevronRightFilled.svg"
import MainLayout from "@/components/layouts/MainLayout";

function PromoteEventPage() {
    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <TopNav/>
                <div
                    className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Promote event</p>
                    </div>
                </div>
                <section className="min-h-screen mt-4 flex flex-col items-center">
                    <div className="flex justify-between gap-[100px]">
                        <div className="flex flex-col">
                            <div className="w-[640px] p-[24px] px-[48px] bg-white rounded-[12px]">
                                <div className="grid gap-2 mt-[24px]">
                                    <Label htmlFor="fullname"
                                           className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Service</Label>
                                    <select className="h-12 rounded-xl bg-light_grey form-font border-0 p-[12px]">
                                        <option>Select service</option>
                                    </select>
                                </div>
                                <div className="flex gap-[16px]">
                                    <div className="grid gap-2 mt-[24px]">
                                        <Label htmlFor="fullname"
                                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Cost</Label>
                                        <Input
                                            id="fullname"
                                            type="text"
                                            placeholder="N0.00"
                                            className="h-[48px] rounded-xl bg-light_grey font-sans font-medium text-[14px] text-text-grey border-0 w-[380px]"
                                        />
                                    </div>
                                    <div className="grid gap-2 mt-[24px]">
                                        <Label htmlFor="fullname"
                                               className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Unit</Label>
                                        <Input
                                            id="fullname"
                                            type="text"
                                            placeholder="N0.00"
                                            className="h-[48px] rounded-xl bg-light_grey form-font border-0"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className="w-[640px] p-[16px] px-[16px] bg-light-tint rounded-[12px] mt-[24px] border-[1px] border-light-green-tint">
                                <p className="font-sans font-semibold text-[12px] leading-[14.4px]">BREAKDOWN</p>
                                <div className="flex flex-col mt-[12px] gap-[12px]">
                                    <div className="flex gap-[8px] items-center">
                                        <ChevronRightFilled/>
                                        <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-black-light">Instagram
                                            Feed Post (x1)</p>
                                    </div>
                                    <div className="flex gap-[8px] items-center">
                                        <ChevronRightFilled/>
                                        <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-black-light">Instagram
                                            Feed Post (x3)</p>
                                    </div>
                                    <div className="flex gap-[8px] items-center">
                                        <ChevronRightFilled/>
                                        <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-black-light">Instagram
                                            Discord campaign</p>
                                    </div>
                                    <div className="flex gap-[8px] items-center">
                                        <ChevronRightFilled/>
                                        <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-black-light">Instagram
                                            Newsletter- Standalone campaign (x1)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="w-[480px] rounded-[12px] p-[24px] px-[16px] bg-white">
                                <p className="font-sans font-semibold text-[20px] leading-[28px]">Summary</p>
                                <div className="flex justify-between mt-[16px]">
                                    <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-text-grey">Event
                                        Boost Combo</p>
                                    <p className="font-sans font-semibold text-[14px] leading-[21px]">₦500,000</p>
                                </div>
                                <div className="flex justify-between mt-[16px]">
                                    <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-text-grey">Unit</p>
                                    <p className="font-sans font-semibold text-[14px] leading-[21px]">1</p>
                                </div>
                                <div className="border-t-[1px] border-t-mid-grey my-[16px]"></div>
                                <div className="flex justify-between mt-[16px]">
                                    <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-text-grey">Subtotal</p>
                                    <p className="font-sans font-semibold text-[14px] leading-[21px]">₦500,000</p>
                                </div>
                                <div className="border-t-[1px] border-t-mid-grey my-[16px]"></div>
                                <div className="flex justify-between mt-[16px]">
                                    <p className="font-sans font-normal text-[18px] leading-[21px] tracking-custom text-text-grey">Total</p>
                                    <p className="font-sans font-semibold text-[18px] leading-[21px]">₦500,000</p>
                                </div>
                                <div
                                    className="mt-[24px] flex justify-around gap-[16px] items-center pt-[16px] pl-[16px] pr-[16px]">
                                    <div className="">
                                        <p className="font-sans font-bold text-mid-green">₦500,000</p>
                                    </div>
                                    <button
                                        className="bg-gradient-green px-[48px] p-[14px] h-[48px] flex items-center rounded-[12px] border-step-color shadow-custom-bottom">
                                        <p className="font-sans font-semi-normal text-[16px] text-white">Pay now</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </MainLayout>
    );
}

export default PromoteEventPage;