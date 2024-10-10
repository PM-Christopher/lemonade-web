import React from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import ChatIcon from "@/image/icons/ChatIcon.svg";
import CalendarIcon from "@/image/icons/CalendarIcon.svg";
import BagIcon from "@/image/icons/CaseIcon.svg";
import BankIcon from "@/image/icons/BankIcon.svg";
import SuppprtIcon from "@/image/icons/SupportIcon.svg";
import ChevronRight from "@/image/icons/ChevronRight.svg";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import EyeIcon from "@/image/icons/EyeIcon.svg";

const ConfirmDeletePage = () => {
    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft/>
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Delete account</p>
                </div>
            </div>
            <section className="min-h-screen mt-4 flex flex-col items-center">
                <div className="w-[640px] rounded-[12px] p-[24px] flex flex-col bg-white gap-4">
                    <p className="text-[16px] font-semi-normal text-black-light">
                        Enter your password to delete your account
                    </p>

                    <div className="grid gap-1 mt-[24px]">
                        <Label htmlFor="username"
                               className="font-normal font-sans text-[14px] leading-[16.8px] text-text-grey">Password</Label>
                        <div
                            className="flex justify-between items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full h-[48px]">
                            <div>
                                <input
                                    id="search"
                                    type="password"
                                    className="rounded-xl h-[48px] text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                    placeholder=""
                                />
                            </div>
                            <EyeIcon/>
                        </div>
                    </div>

                    <div className="flex justify-between gap-[16px] mt-[24px]">
                        <Button
                            className="bg-red-1 h-[48px] shadow-none border-[1px] border-red-2 rounded-[12px] w-full">
                            <p className="font-semi-normal text-[16px]">Delete account</p>
                        </Button>
                        <Button className="bg-transparent shadow-none h-[48px] border-none w-full">
                            <p className="font-semi-normal text-[16px] text-light-green">Cancel</p>
                        </Button>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default ConfirmDeletePage;