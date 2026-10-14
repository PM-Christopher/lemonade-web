import { images } from "@/lib/images";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React from "react";
import VerIcon from "@/images/icons/verifiedFilledIcon.svg";
import PadlockIcon from "@/images/icons/padlockFilledIcon.svg";
import ChatIcon from "@/images/icons/chatFilledIcon.svg";
import LemonIcon from "@/images/icons/lemonFilledIcon.svg";
import CalendarIcon from "@/images/icons/calendarFilledIcon.svg";
import TicketIcon from "@/images/icons/ticketFilledIcon.svg";
import BagIcon from "@/images/icons/caseFilledIcon.svg";
import WebIcon from "@/images/icons/webFilledIcon.svg";
import ReferralIcon from "@/images/icons/referralFilledIcon.svg";
import { Button } from "@lemonade/ui";

import CheckIcon from "@/images/icons/checkGreenIcon.svg";
import { useAppDispatch } from "@/redux/hook";
import { changeReason, setSubscriptionId } from "@/features/authentication/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export interface PricingPlan {
  id: number;
  title?: string;
  access_type?: string;
  monthly_charge?: number;
  ver_badge?: boolean;
  forum_creation?: boolean;
  lemon_id?: boolean;
  event_creation?: number;
  sales_commission?: number;
  service_commission?: number;
  connection_range?: string;
  offline_benefits?: boolean;
}

type PricingInterface = {
  active: boolean;
  subscription: PricingPlan;
  toggle: () => void;
  setSubId: (id: number) => void;
  toggleSubMode: (mode: string) => void;
  fetchPlan: (id: number) => void;
};

const PricingCard: React.FC<PricingInterface> = ({
  active,
  subscription,
  toggle,
  setSubId,
  toggleSubMode,
  fetchPlan,
}) => {
  const { push } = useNavigation();
  const dispatch = useAppDispatch();
  const { subscription: user_sub } = useSelector((state: RootState) => state.auth);

  const handleSubscribe = (id: number, subscription: PricingPlan) => {
    setSubId(id);
    fetchPlan(id);
    if (user_sub) {
      if (user_sub.title === "Pay-As-You-Go") {
        toggle();
        toggleSubMode("upgrade");
      } else {
        toggleSubMode("downgrade");
        dispatch(changeReason({ sub_id: id }));
        dispatch(setSubscriptionId({ id, plan: subscription }));
        push(routes.SETTINGS_PLAN_CANCEL);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-65 rounded-tl-2xl rounded-tr-2xl px-12 pt-4"
        style={{ background: active ? `url(${images.PRICING_BG})` : "#F4F4F6" }}
      >
        <p className="font-ruso text-title-r text-center leading-normal font-normal">
          {subscription?.title}
        </p>
        <p className="text-light-black text-body-l text-center font-normal">
          {subscription?.access_type} access
        </p>
      </div>
      <div
        className={`w-77.75 rounded-xl border-2 ${active ? "border-step-color" : "border-light-grey-60"}`}
      >
        <div className={`rounded-tl-xl rounded-tr-xl ${active ? "bg-step-color" : "bg-grey-20"}`}>
          {subscription?.monthly_charge === 0 ? (
            <p className="text-body-l p-3 font-semibold">Free forever</p>
          ) : (
            <p className="text-body-l p-3 font-semibold">N{subscription?.monthly_charge}/month</p>
          )}
        </div>
        <div className="flex flex-col gap-5 rounded-br-xl rounded-bl-xl bg-white p-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <VerIcon />
              <p className="font-semi-normal text-body-s">Verification badge</p>
            </div>
            {subscription?.ver_badge ? <CheckIcon /> : <PadlockIcon />}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <ChatIcon />
              <p className="font-semi-normal text-body-s">Tribe creation</p>
            </div>
            {subscription?.forum_creation ? <CheckIcon /> : <PadlockIcon />}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <LemonIcon />
              <p className="font-semi-normal text-body-s">Lemon ID</p>
            </div>
            {subscription?.lemon_id ? <CheckIcon /> : <PadlockIcon />}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <p className="font-semi-normal text-body-s">Event creation</p>
            </div>
            {subscription?.event_creation === 0 ? (
              <p className="font-semi-normal text-text-grey text-body-s">Unlimited</p>
            ) : (
              <p className="font-semi-normal text-text-grey text-body-s">
                {subscription?.event_creation} monthly
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <TicketIcon />
              <p className="font-semi-normal text-body-s">Ticket sales commission</p>
            </div>
            {subscription?.sales_commission === 0 ? (
              <p className="font-semi-normal text-text-grey text-body-s">None</p>
            ) : (
              <p className="font-semi-normal text-text-grey text-body-s">
                {subscription?.sales_commission}%
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <BagIcon />
              <p className="font-semi-normal text-body-s">Service commission</p>
            </div>
            {subscription?.service_commission === 0 ? (
              <p className="font-semi-normal text-text-grey text-body-s">None</p>
            ) : (
              <p className="font-semi-normal text-text-grey text-body-s">
                {subscription?.service_commission}%
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <WebIcon />
              <p className="font-semi-normal text-body-s">Connection range</p>
            </div>
            <p className="font-semi-normal text-text-grey text-body-s">
              {subscription.connection_range}
            </p>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <ReferralIcon />
              <p className="font-semi-normal text-body-s">Offline benefits</p>
            </div>
            {subscription?.offline_benefits ? <CheckIcon /> : <PadlockIcon />}
          </div>
        </div>
      </div>
      <Button
        className={`mt-14 h-12 rounded-xl border p-3.5 px-17.5 shadow-none ${!active ? "bg-gradient-green" : "border-light-grey-70 bg-light-grey-70"}`}
      >
        {!active ? (
          <p
            className="font-semi-normal text-body-l"
            onClick={() => handleSubscribe(subscription.id, subscription)}
          >
            Subscribe
          </p>
        ) : (
          <p className="font-semi-normal text-text-grey text-body-l">Current plan</p>
        )}
      </Button>
    </div>
  );
};

export default PricingCard;
