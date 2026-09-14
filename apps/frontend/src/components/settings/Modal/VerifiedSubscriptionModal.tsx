"use client";
import React, {useEffect, useCallback} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import CloseIcon from "@/images/icons/close.svg";
import VerIcon from "@/images/icons/greenVerIcon.svg";
import GreyVerIcon from "@/images/icons/verifiedFilledIcon.svg";
import CheckIcon from "@/images/icons/checkGreenIcon.svg";
import PadlockIcon from "@/images/icons/padlockFilledIcon.svg";
import ChatIcon from "@/images/icons/chatFilledIcon.svg";
import LemonIcon from "@/images/icons/lemonFilledIcon.svg";
import CalendarIcon from "@/images/icons/calendarFilledIcon.svg";
import TicketIcon from "@/images/icons/ticketFilledIcon.svg";
import BagIcon from "@/images/icons/caseFilledIcon.svg";
import WebIcon from "@/images/icons/webFilledIcon.svg";
import ReferralIcon from "@/images/icons/referralFilledIcon.svg";

interface Subscription {
    ver_badge?: boolean;
    forum_creation?: boolean;
    lemon_id?: boolean;
    event_creation?: number;
    sales_commission?: number;
    service_commission?: number;
    connection_range?: string;
    offline_benefits?: boolean;
}

interface VerifiedSuccessProps {
    isOpen: boolean;
    toggle: () => void;
    data: {
        subscription: Subscription;
    };
}

const VerifiedSubscriptionModal: React.FC<VerifiedSuccessProps> = ({
                                                                       isOpen,
                                                                       toggle,
                                                                       data,
                                                                   }) => {
    const {user} = useSelector((state: RootState) => state.auth);
    const {subscription} = data || {};

    // Close modal on ESC key
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) toggle();
        },
        [isOpen, toggle]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    if (!isOpen) return null;

    const benefits = [
        {icon: GreyVerIcon, label: "Verification badge", value: subscription?.ver_badge},
        {icon: ChatIcon, label: "Tribe creation", value: subscription?.forum_creation},
        {icon: LemonIcon, label: "Lemon ID", value: subscription?.lemon_id},
        {
            icon: CalendarIcon,
            label: "Event creation",
            value:
                subscription?.event_creation === 0
                    ? "Unlimited"
                    : `${subscription?.event_creation ?? 0} monthly`,
        },
        {
            icon: TicketIcon,
            label: "Ticket sales commission",
            value:
                subscription?.sales_commission === 0
                    ? "None"
                    : `${subscription?.sales_commission ?? 0}%`,
        },
        {
            icon: BagIcon,
            label: "Service commission",
            value:
                subscription?.service_commission === 0
                    ? "None"
                    : `${subscription?.service_commission ?? 0}%`,
        },
        {
            icon: WebIcon,
            label: "Connection range",
            value: subscription?.connection_range ?? "--",
        },
        {icon: ReferralIcon, label: "Offline benefits", value: subscription?.offline_benefits},
    ];

    return (
        <div
            className="
        fixed inset-0 bg-gray-800/60 backdrop-blur-sm 
        flex items-center justify-center z-50
        animate-fadeIn
      "
            role="dialog"
            aria-modal="true"
        >
            <div
                className="
          bg-white rounded-2xl shadow-2xl 
          w-[640px] max-w-[92%]
          p-6 sm:p-8
          max-h-[90vh] overflow-y-auto hide-scrollbar
          flex flex-col
          animate-scaleIn
        "
            >
                {/* Header */}
                <div
                    className="flex justify-between items-center sticky top-0 bg-white z-10 pb-3 border-b border-gray-100">
                    <button
                        aria-label="Close"
                        className="cursor-pointer hover:opacity-80 transition"
                        onClick={toggle}
                    >
                        <CloseIcon/>
                    </button>

                    <button
                        type="button"
                        onClick={toggle}
                        className="
              flex items-center justify-center gap-2 px-4 py-2
              rounded-xl font-sans text-white font-medium text-[16px]
              transition-all duration-300 border border-step-color
              bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong
            "
                    >
                        <span>Done</span>
                    </button>
                </div>

                {/* Content */}
                <div className="mt-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-2 sm:text-left">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-[18px]">{user?.fullname}</p>
                            <VerIcon className="w-[20px] h-[20px]"/>
                        </div>
                        <p className="font-ruso text-[32px] sm:text-[40px] text-black-light leading-tight">
                            Welcome to Membership
                        </p>
                    </div>

                    <p className="text-light-black font-medium text-[16px] sm:text-left">
                        You&apos;ve unlocked all membership access
                    </p>

                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col gap-5">
                        {benefits.map(({icon: Icon, label, value}, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                    <Icon className="w-[14px] h-[14px]"/>
                                    <p className="font-medium text-[14px] text-gray-800">{label}</p>
                                </div>

                                {typeof value === "boolean" ? (
                                    value ? <CheckIcon/> : <PadlockIcon/>
                                ) : (
                                    <p className="font-normal text-[14px] text-text-grey">{value}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifiedSubscriptionModal;
