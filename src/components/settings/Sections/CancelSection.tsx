import React from 'react';
import {Button} from "@/components/ui/button";
import {useSelector} from "react-redux";
import CheckIcon from "@/images/icons/checkGreenIcon.svg";
import PadlockIcon from "@/images/icons/padlockFilledIcon.svg";

const CancelSection = ({}) => {
    const { plan } = useSelector((state: any) => state.auth)
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
                    {
                        plan?.ver_badge ? (
                            <CheckIcon />
                        ) : (
                            <PadlockIcon/>
                        )
                    }
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Tribe creation</p>
                    {
                        plan?.forum_creation ? (
                            <CheckIcon />
                        ) : (
                            <PadlockIcon/>
                        )
                    }
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Lemon ID</p>
                    {
                        plan?.lemon_id ? (
                            <CheckIcon />
                        ) : (
                            <PadlockIcon/>
                        )
                    }
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Event creation</p>
                    {
                        plan?.event_creation === 0 ? (
                            <p className="font-semi-normal text-[14px] text-text-grey">Unlimited</p>
                        ) : (
                            <p className="font-semi-normal text-[14px] text-text-grey">{plan?.event_creation} monthly</p>
                        )
                    }
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Ticket sales commission</p>
                    {
                        plan?.sales_commission === 0 ? (
                            <p className="font-semi-normal text-[14px] text-text-grey">None</p>
                        ) : (
                            <p className="font-semi-normal text-[14px] text-text-grey">{plan?.sales_commission}%</p>
                        )
                    }
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Service commission</p>
                    {
                        plan?.service_commission === 0 ? (
                            <p className="font-semi-normal text-[14px] text-text-grey">None</p>
                        ) : (
                            <p className="font-semi-normal text-[14px] text-text-grey">{plan?.service_commission}%</p>
                        )
                    }
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Connection range</p>
                    <p className="font-semi-normal text-[14px] text-text-grey">{plan.connection_range}</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semi-normal text-[14px] text-black-light">Offline benefits</p>
                    {
                        plan?.offline_benefits ? (
                            <CheckIcon />
                        ) : (
                            <PadlockIcon/>
                        )
                    }
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