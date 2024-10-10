"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import GiftImage from "@/image/GiftImage.png"
import Image from "next/image";
import CopyIcon from "@/image/icons/CopyGreenIcon.svg"
import ShareIcon from "@/image/icons/ShareGreenIcon.svg"
import ReferralIcon from "@/image/icons/ReferralGreenIcon.svg"
import LongLine from "@/image/icons/LongLine.svg"
import ChevronRight from "@/image/icons/ChevronRight.svg"
import ReferralHistory from "@/components/Settings/Modal/ReferralHistory";

function ReferralSettingsPage({}) {
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
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Account settings</p>
                </div>
            </div>
            <section className="min-h-screen mt-4 flex flex-col items-center">
                <div className="flex flex-col items-center gap-[16px]">
                    <div className="bg-light-green-10 rounded-[12px]">
                        <div className="w-[560px] p-[24px] flex justify-center items-center">
                            <Image src={GiftImage} alt="gift_image"/>
                        </div>
                        <div className="w-[560px] p-[24px] flex flex-col gap-[8px]">
                            <div className="flex justify-between items-center gap-[2px]">
                                <div
                                    className="rounded-tl-[12px] rounded-bl-[12px] px-[12px] p-[10.5px] bg-light-tint-4 w-full">
                                    <p className="font-bold text-[18px] text-mid-green">CHRI321</p>
                                </div>
                                <div
                                    className="rounded-tr-[12px] rounded-br-[12px] px-[12px] bg-light-tint-4 w-fit items-center flex h-[48px]">
                                    <CopyIcon/>
                                </div>
                            </div>

                            <div className="flex justify-between items-center gap-[2px]">
                                <div
                                    className="rounded-tl-[12px] rounded-bl-[12px] px-[12px] h-[48px] bg-light-tint-4 w-full items-center flex">
                                    <p className="font-semi-normal text-[14px] text-mid-green">https://app.lemonade.com/ref=?chris321</p>
                                </div>
                                <div
                                    className="rounded-tr-[12px] rounded-br-[12px] px-[12px] bg-light-tint-4 w-fit items-center flex h-[48px]">
                                    <ShareIcon/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[560px] p-[24px] flex flex-col gap-[8px] mt-[24px] bg-white rounded-[12px]">
                        <p className="font-semibold text-[16px]">Refer friends and earn</p>
                        <div className="flex flex-col mt-[24px]">
                            <div className="flex gap-[16px]">
                                <div className="bg-light-green-10 p-[12px] rounded-[12px]">
                                    <ReferralIcon className="w-[24px] h-[24px]"/>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-semibold text-[16px]">2% of the subscription fee</p>
                                    <p className="font-normal text-[14px] text-text-grey">When they subscribe to
                                        Membership</p>
                                </div>
                            </div>
                            <div className="relative left-[21px]">
                                <LongLine className="w-[4px] h-[48px]" />
                            </div>
                            <div className="flex gap-[16px]">
                                <div className="bg-light-green-10 p-[12px] rounded-[12px]">
                                    <ReferralIcon className="w-[24px] h-[24px]"/>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-semibold text-[16px]">2% of the renewal fee</p>
                                    <p className="font-normal text-[14px] text-text-grey">When they renew their
                                        Subscription</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-[24px]">
                            <p className="font-semi-normal text-[16px]">Referral activity</p>
                            <ChevronRight />
                        </div>
                    </div>
                </div>
            </section>
            <ReferralHistory toggle={toggleModal} isOpen={isOpen} />
        </section>
    );
}

export default ReferralSettingsPage;