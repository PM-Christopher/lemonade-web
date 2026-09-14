import React from 'react';
import VerIcon from "@/images/icons/verifiedFilledIcon.svg";
import PadlockIcon from "@/images/icons/padlockFilledIcon.svg";
import ChatIcon from "@/images/icons/chatFilledIcon.svg";
import LemonIcon from "@/images/icons/lemonFilledIcon.svg";
import CalendarIcon from "@/images/icons/calendarFilledIcon.svg";
import TicketIcon from "@/images/icons/ticketFilledIcon.svg";
import BagIcon from "@/images/icons/caseFilledIcon.svg";
import WebIcon from "@/images/icons/webFilledIcon.svg";
import ReferralIcon from "@/images/icons/referralFilledIcon.svg";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import CheckIcon from "@/images/icons/checkGreenIcon.svg"
import {useAppDispatch} from "@/redux/hook";
import {changeReason, setSubscriptionId} from "@/features/authentication/authSlice";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";

type PricingInterface = {
    active: boolean,
    subscription: any
    toggle: () => void
    setSubId: (id: number) => void
    toggleSubMode: (mode: string) => void
    fetchPlan: (id: number) => void
}

const PricingCard: React.FC<PricingInterface> = ({active, subscription, toggle, setSubId, toggleSubMode, fetchPlan}) => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { user, subscription: user_sub } = useSelector((state:RootState) => state.auth)

    const handleSubscribe = (id: number, subscription: any) => {
        setSubId(id)
        fetchPlan(id)
        if (user_sub) {
            if (user_sub.title === 'Pay-As-You-Go') {
                toggle()
                toggleSubMode("upgrade")
            } else {
                toggleSubMode("downgrade")
                dispatch(changeReason({ sub_id: id }));
                dispatch(setSubscriptionId({ id, plan: subscription }))
                router.push("/settings/plan/cancel-subscription")
            }
        }
    }

    return (
        <div className="flex flex-col items-center">
            <div className="w-[260px] pt-[16px] px-[48px] rounded-tl-[16px] rounded-tr-[16px]"
                 style={{background: `${active ? "url('/images/pricingbg.png')" : "#F4F4F6"}`}}>
                <p className="font-ruso font-normal text-[20px] text-center">{subscription?.title}</p>
                <p className="font-normal text-[16px] text-center text-light-black">{subscription?.access_type} access</p>
            </div>
            <div
                className={`w-[311px] rounded-[12px] border-[2px] ${active ? "border-step-color" : "border-light-grey-60"}`}>
                <div className={`rounded-tl-[12px] rounded-tr-[12px] ${active ? "bg-step-color" : "bg-grey-20"}`}>
                    {
                        subscription?.monthly_charge === 0 ? (
                            <p className="font-semibold text-[16px] p-[12px]">Free forever</p>
                        ) : (
                            <p className="font-semibold text-[16px] p-[12px]">N{subscription?.monthly_charge}/month</p>
                        )
                    }
                </div>
                <div className="bg-white p-4 flex flex-col rounded-bl-[12px] rounded-br-[12px] gap-[20px]">
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <VerIcon/>
                            <p className="font-semi-normal text-[14px]">Verification badge</p>
                        </div>
                        {
                            subscription?.ver_badge ? (
                                <CheckIcon />
                            ) : (
                                <PadlockIcon/>
                            )
                        }
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <ChatIcon/>
                            <p className="font-semi-normal text-[14px]">Tribe creation</p>
                        </div>
                        {
                            subscription?.forum_creation ? (
                                <CheckIcon />
                            ) : (
                                <PadlockIcon/>
                            )
                        }
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <LemonIcon/>
                            <p className="font-semi-normal text-[14px]">Lemon ID</p>
                        </div>
                        {
                            subscription?.lemon_id ? (
                                <CheckIcon />
                            ) : (
                                <PadlockIcon/>
                            )
                        }
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <CalendarIcon/>
                            <p className="font-semi-normal text-[14px]">Event creation</p>
                        </div>
                        {
                            subscription?.event_creation === 0 ? (
                                <p className="font-semi-normal text-[14px] text-text-grey">Unlimited</p>
                            ) : (
                                <p className="font-semi-normal text-[14px] text-text-grey">{subscription?.event_creation} monthly</p>
                            )
                        }
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <TicketIcon/>
                            <p className="font-semi-normal text-[14px]">Ticket sales commission</p>
                        </div>
                        {
                            subscription?.sales_commission === 0 ? (
                                <p className="font-semi-normal text-[14px] text-text-grey">None</p>
                            ) : (
                                <p className="font-semi-normal text-[14px] text-text-grey">{subscription?.sales_commission}%</p>
                            )
                        }
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <BagIcon/>
                            <p className="font-semi-normal text-[14px]">Service commission</p>
                        </div>
                        {
                            subscription?.service_commission === 0 ? (
                                <p className="font-semi-normal text-[14px] text-text-grey">None</p>
                            ) : (
                                <p className="font-semi-normal text-[14px] text-text-grey">{subscription?.service_commission}%</p>
                            )
                        }
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <WebIcon/>
                            <p className="font-semi-normal text-[14px]">Connection range</p>
                        </div>
                        <p className="font-semi-normal text-[14px] text-text-grey">{subscription.connection_range}</p>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <ReferralIcon/>
                            <p className="font-semi-normal text-[14px]">Offline benefits</p>
                        </div>
                        {
                            subscription?.offline_benefits ? (
                                <CheckIcon />
                            ) : (
                                <PadlockIcon/>
                            )
                        }
                    </div>
                </div>
            </div>
            <Button className={`h-[48px] shadow-none border-[1px] rounded-[12px] p-[14px] px-[70px] mt-[56px] ${!active ? "bg-gradient-green" : "bg-light-grey-70 border-light-grey-70"}`}>
                {
                    !active ? (
                        <p className="font-semi-normal text-[16px]" onClick={() => handleSubscribe(subscription.id, subscription)}>Subscribe</p>
                    ) : (
                        <p className="font-semi-normal text-[16px] text-text-grey">Current plan</p>
                    )
                }
            </Button>
        </div>
    );
}

export default PricingCard;