import React from 'react';
import CheckedIcon from "@/image/icons/CheckedFilledIcon.svg";
import {Button} from "@/components/ui/button";

const CancelSection = ({}) => {
    return (
        <div className="w-[640px] rounded-[12px] p-[24px] flex flex-col bg-white gap-4">
            <div>
                <p className="font-semibold text-[20px]">We are sorry to see you go</p>
                <p className="font-normal text-[14px] text-light-black">You will lose the following plan
                    benefits if you downgrade</p>
            </div>
            <div className="bg-mid-grey p-[24px] rounded-[12px] flex flex-col gap-[16px]">
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Verification badge</p>
                    <CheckedIcon/>
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Tribe creation</p>
                    <CheckedIcon/>
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Lemon ID</p>
                    <CheckedIcon/>
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Event creation</p>
                    <p className="font-semi-normal text-[14px] text-text-grey">Unlimited</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Ticket sales commission</p>
                    <p className="font-semi-normal text-[14px] text-text-grey">None</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Service commission</p>
                    <p className="font-semi-normal text-[14px] text-text-grey">None</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Connection range</p>
                    <p className="font-semi-normal text-[14px] text-text-grey">Unlimited</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Offline benefits</p>
                    <CheckedIcon/>
                </div>
            </div>
            <div className="flex justify-between gap-[16px] mt-[24px]">
                <Button
                    className="bg-gradient-green shadow-custom-bottom h-[48px] rounded-[12px] w-full">
                    <p className="font-semi-normal text-[16px]">Continue to downgrade</p>
                </Button>
                <Button className="bg-white hover:bg-white shadow-none h-[48px] border-[1px] rounded-[12px] w-full">
                    <p className="font-semi-normal text-[16px] text-black-light">Keep my current plan</p>
                </Button>
            </div>
        </div>
    );
}

export default CancelSection;