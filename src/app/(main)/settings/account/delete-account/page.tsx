import React from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import ChatIcon from "@/image/icons/ChatIcon.svg"
import CalendarIcon from "@/image/icons/CalendarIcon.svg"
import BagIcon from "@/image/icons/CaseIcon.svg"
import BankIcon from "@/image/icons/BankIcon.svg"
import SuppprtIcon from "@/image/icons/SupportIcon.svg";
import ChevronRight from "@/image/icons/ChevronRight.svg";
import {Button} from "@/components/ui/button";

const DeleteAccountPage = () => {
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
                    <p className="max-w-[592px] font-normal text-[14px] text-light-black">
                        Deleting your account permanently removes your data from our system. You will have a <span
                        className="font-semibold">30-day</span> grace period to change your mind. If you log in to your
                        account within 30 days of deletion, your account will be reactivated.
                    </p>
                    <div className="mt-[24px] p-[16px] bg-light_grey flex flex-col gap-[16px]">
                        <p className="text-[14px] font-semibold">Before you go, make sure</p>
                        <div className="flex gap-2 items-center">
                            <ChatIcon/>
                            <p className="font-normal text-[14px] text-black-light">You have deleted all Tribes you
                                created</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <CalendarIcon/>
                            <p className="font-normal text-[14px] text-black-light">You have no active events you
                                created</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <BagIcon/>
                            <p className="font-normal text-[14px] text-black-light">You have completed all pending
                                jobs</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <BankIcon/>
                            <p className="font-normal text-[14px] text-black-light max-w-[287px]">You request wallet
                                withdrawal from ticket sales, and completed jobs to your local bank</p>
                        </div>
                        <p className="font-normal text-[14px] text-light-black">Your account cannot be deleted if these
                            criteria are not met</p>
                    </div>
                    <div className="flex justify-between items-center mt-[36px]">
                        <div className="flex gap-[8px] items-center">
                            <SuppprtIcon/>
                            <p className="font-semi-normal text-[14px]">Reach out to support for any pending issues</p>
                        </div>
                        <ChevronRight/>
                    </div>
                    <div className="flex justify-between gap-[16px] mt-[24px]">
                        <Button className="bg-red-1 h-[48px] shadow-none border-[1px] border-red-2 rounded-[12px] w-full">
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

export default DeleteAccountPage;