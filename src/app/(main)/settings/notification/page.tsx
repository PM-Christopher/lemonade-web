"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import ChevronRight from "@/image/icons/ChevronRight.svg";
import NotificationSettingsModal from "@/components/Settings/Modal/NotificationSettingsModal";

const NotificationSettingsPage = () => {
    const [isOpen, setIsOpen] = useState(true)

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }
    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft/>
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Notification settings</p>
                </div>
            </div>
            <section className="min-h-screen mt-4 flex flex-col items-center">
                <div className="w-[640px] rounded-[12px] flex flex-col gap-[24px]">
                    <div className="flex flex-col gap-[16px]">
                        <p className="font-semi-normal text-[12px] text-light-black">TRIBE</p>
                        <div className="w-[640px] rounded-[12px] flex flex-col bg-white">
                            <div className="flex justify-between p-[12px] px-[16px] items-center">
                                <div className="flex flex-col">
                                    <p className="font-semi-normal text-[14px]">New thread in Tribe</p>
                                    <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                </div>
                                <ChevronRight className="cursor-pointer" onClick={toggleModal}/>
                            </div>
                            <div className="flex justify-between p-[12px] px-[16px] items-center">
                                <div className="flex flex-col">
                                    <p className="font-semi-normal text-[14px]">Thread engagements</p>
                                    <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                </div>
                                <ChevronRight/>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-[16px]">
                        <p className="font-semi-normal text-[12px] text-light-black">EVENT</p>
                        <div className="w-[640px] rounded-[12px] flex flex-col bg-white">
                            <div className="flex justify-between p-[12px] px-[16px] items-center">
                                <div className="flex flex-col">
                                    <p className="font-semi-normal text-[14px]">Ticket sales</p>
                                    <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                </div>
                                <ChevronRight/>
                            </div>
                            <div className="flex justify-between p-[12px] px-[16px] items-center">
                                <div className="flex flex-col">
                                    <p className="font-semi-normal text-[14px]">Ticket payout</p>
                                    <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                </div>
                                <ChevronRight/>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-[16px]">
                        <p className="font-semi-normal text-[12px] text-light-black">BUSINESS</p>
                        <div className="w-[640px] rounded-[12px] flex flex-col bg-white">
                            <div className="flex justify-between p-[12px] px-[16px] items-center">
                                <div className="flex flex-col">
                                    <p className="font-semi-normal text-[14px]">Service offer</p>
                                    <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                </div>
                                <ChevronRight/>
                            </div>
                            <div className="flex justify-between p-[12px] px-[16px] items-center">
                                <div className="flex flex-col">
                                    <p className="font-semi-normal text-[14px]">Service status</p>
                                    <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                </div>
                                <ChevronRight/>
                            </div>
                            <div className="flex justify-between p-[12px] px-[16px] items-center">
                                <div className="flex flex-col">
                                    <p className="font-semi-normal text-[14px]">Service payout</p>
                                    <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                </div>
                                <ChevronRight/>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-[16px]">
                        <p className="font-semi-normal text-[12px] text-light-black">CONNECT</p>
                        <div className="w-[640px] rounded-[12px] flex flex-col bg-white">
                            <div className="flex justify-between p-[12px] px-[16px] items-center">
                                <div className="flex flex-col">
                                    <p className="font-semi-normal text-[14px]">Connect request</p>
                                    <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                </div>
                                <ChevronRight/>
                            </div>
                            <div className="flex justify-between p-[12px] px-[16px] items-center">
                                <div className="flex flex-col">
                                    <p className="font-semi-normal text-[14px]">New message</p>
                                    <p className="font-normal text-[12px] text-text-grey">In-app, Email</p>
                                </div>
                                <ChevronRight/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <NotificationSettingsModal isOpen={isOpen} toggle={toggleModal} />
        </section>
    );
}

export default NotificationSettingsPage;