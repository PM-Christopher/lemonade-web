"use client";
import React from "react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
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

const VerifiedSubscriptionModal: React.FC<VerifiedSuccessProps> = ({ isOpen, toggle, data }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { subscription } = data || {};

  if (!isOpen) return null;

  const benefits = [
    {
      icon: GreyVerIcon,
      label: "Verification badge",
      value: subscription?.ver_badge,
    },
    {
      icon: ChatIcon,
      label: "Tribe creation",
      value: subscription?.forum_creation,
    },
    { icon: LemonIcon, label: "Lemon ID", value: subscription?.lemon_id },
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
        subscription?.sales_commission === 0 ? "None" : `${subscription?.sales_commission ?? 0}%`,
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
    {
      icon: ReferralIcon,
      label: "Offline benefits",
      value: subscription?.offline_benefits,
    },
  ];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Welcome to Membership</DialogTitle>
        <div className="hide-scrollbar animate-scaleIn flex max-h-[90vh] w-[640px] max-w-[92%] flex-col overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white pb-3">
            <button
              aria-label="Close"
              className="cursor-pointer transition hover:opacity-80"
              onClick={toggle}
            >
              <CloseIcon />
            </button>

            <button
              type="button"
              onClick={toggle}
              className="border-step-color bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong flex items-center justify-center gap-2 rounded-xl border px-4 py-2 font-sans text-[16px] font-medium text-white transition-all duration-300"
            >
              <span>Done</span>
            </button>
          </div>

          {/* Content */}
          <div className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2 sm:text-left">
              <div className="flex items-center gap-2">
                <p className="text-[18px] font-semibold">{user?.fullname}</p>
                <VerIcon className="h-[20px] w-[20px]" />
              </div>
              <p className="font-ruso text-black-light text-[32px] leading-tight sm:text-[40px]">
                Welcome to Membership
              </p>
            </div>

            <p className="text-light-black text-[16px] font-medium sm:text-left">
              You&apos;ve unlocked all membership access
            </p>

            <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-gray-50 p-5">
              {benefits.map(({ icon: Icon, label, value }, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-[14px] w-[14px]" />
                    <p className="text-[14px] font-medium text-gray-800">{label}</p>
                  </div>

                  {typeof value === "boolean" ? (
                    value ? (
                      <CheckIcon />
                    ) : (
                      <PadlockIcon />
                    )
                  ) : (
                    <p className="text-text-grey text-[14px] font-normal">{value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default VerifiedSubscriptionModal;
