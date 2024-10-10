import React from 'react';
import VerIcon from "@/image/icons/VerifiedFilledIcon.svg";
import PadlockIcon from "@/image/icons/PadlockFilledIcon.svg";
import ChatIcon from "@/image/icons/ChatFilledIcon.svg";
import LemonIcon from "@/image/icons/LemonFilledIcon.svg";
import CalendarIcon from "@/image/icons/CalendarFilledIcon.svg";
import TicketIcon from "@/image/icons/TicketFilledIcon.svg";
import BagIcon from "@/image/icons/CaseFilledIcon.svg";
import WebIcon from "@/image/icons/WebFilledIcon.svg";
import ReferralIcon from "@/image/icons/ReferralFilledIcon.svg";
import {Button} from "@/components/ui/button";

type PricingInterface = {
    active: boolean
}

const PricingCard: React.FC<PricingInterface> = ({active}) => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-[260px] pt-[16px] px-[48px] rounded-tl-[16px] rounded-tr-[16px]"
                 style={{background: `${active ? "url('/images/pricingbg.png')" : "#F4F4F6"}`}}>
                <p className="font-ruso font-normal text-[20px] text-center">PAY-AS-YOU-GO</p>
                <p className="font-normal text-[16px] text-center text-light-black">Limited access</p>
            </div>
            <div
                className={`w-[311px] rounded-[12px] border-[2px] ${active ? "border-step-color" : "border-light-grey-60"}`}>
                <div className={`rounded-tl-[12px] rounded-tr-[12px] ${active ? "bg-step-color" : "bg-grey-20"}`}>
                    <p className="font-semibold text-[16px] p-[12px]">Free forever</p>
                </div>
                <div className="bg-white p-4 flex flex-col rounded-bl-[12px] rounded-br-[12px] gap-[20px]">
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <VerIcon/>
                            <p className="font-semi-normal text-[14px]">Verification badge</p>
                        </div>
                        <PadlockIcon/>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <ChatIcon/>
                            <p className="font-semi-normal text-[14px]">Tribe creation</p>
                        </div>
                        <PadlockIcon/>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <LemonIcon/>
                            <p className="font-semi-normal text-[14px]">Lemon ID</p>
                        </div>
                        <PadlockIcon/>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <CalendarIcon/>
                            <p className="font-semi-normal text-[14px]">Event creation</p>
                        </div>
                        <p className="font-semi-normal text-[14px] text-text-grey">2 monthly</p>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <TicketIcon/>
                            <p className="font-semi-normal text-[14px]">Ticket sales commission</p>
                        </div>
                        <p className="font-semi-normal text-[14px] text-text-grey">15%</p>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <BagIcon/>
                            <p className="font-semi-normal text-[14px]">Service commission</p>
                        </div>
                        <p className="font-semi-normal text-[14px] text-text-grey">10%</p>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <WebIcon/>
                            <p className="font-semi-normal text-[14px]">Connection range</p>
                        </div>
                        <p className="font-semi-normal text-[14px] text-text-grey">Limited</p>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <ReferralIcon/>
                            <p className="font-semi-normal text-[14px]">Offline benefits</p>
                        </div>
                        <PadlockIcon/>
                    </div>
                </div>
            </div>
            <Button className={`h-[48px] shadow-none border-[1px] rounded-[12px] p-[14px] px-[70px] mt-[56px] ${!active ? "bg-gradient-green" : "bg-light-grey-70 border-light-grey-70"}`}>
                {
                    !active ? (
                        <p className="font-semi-normal text-[16px]">Subscribe</p>
                    ) : (
                        <p className="font-semi-normal text-[16px] text-text-grey">Current plan</p>
                    )
                }
            </Button>
        </div>
    );
}

export default PricingCard;