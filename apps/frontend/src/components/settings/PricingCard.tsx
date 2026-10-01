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
import { useRouter } from "next/navigation";
import CheckIcon from "@/images/icons/checkGreenIcon.svg";
import { useAppDispatch } from "@/redux/hook";
import { changeReason, setSubscriptionId } from "@/features/authentication/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type PricingInterface = {
  active: boolean;
  subscription: any;
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, subscription: user_sub } = useSelector((state: RootState) => state.auth);

  const handleSubscribe = (id: number, subscription: any) => {
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
        router.push("/settings/plan/cancel-subscription");
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-[260px] rounded-tl-2xl rounded-tr-2xl px-12 pt-4"
        style={{ background: `${active ? "url('/images/pricingbg.png')" : "#F4F4F6"}` }}
      >
        <p className="font-ruso text-center text-[20px] font-normal">{subscription?.title}</p>
        <p className="text-light-black text-center text-[16px] font-normal">
          {subscription?.access_type} access
        </p>
      </div>
      <div
        className={`w-[311px] rounded-xl border-2 ${active ? "border-step-color" : "border-light-grey-60"}`}
      >
        <div className={`rounded-tl-xl rounded-tr-xl ${active ? "bg-step-color" : "bg-grey-20"}`}>
          {subscription?.monthly_charge === 0 ? (
            <p className="p-3 text-[16px] font-semibold">Free forever</p>
          ) : (
            <p className="p-3 text-[16px] font-semibold">N{subscription?.monthly_charge}/month</p>
          )}
        </div>
        <div className="flex flex-col gap-5 rounded-br-xl rounded-bl-xl bg-white p-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <VerIcon />
              <p className="font-semi-normal text-[14px]">Verification badge</p>
            </div>
            {subscription?.ver_badge ? <CheckIcon /> : <PadlockIcon />}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <ChatIcon />
              <p className="font-semi-normal text-[14px]">Tribe creation</p>
            </div>
            {subscription?.forum_creation ? <CheckIcon /> : <PadlockIcon />}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <LemonIcon />
              <p className="font-semi-normal text-[14px]">Lemon ID</p>
            </div>
            {subscription?.lemon_id ? <CheckIcon /> : <PadlockIcon />}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <p className="font-semi-normal text-[14px]">Event creation</p>
            </div>
            {subscription?.event_creation === 0 ? (
              <p className="font-semi-normal text-text-grey text-[14px]">Unlimited</p>
            ) : (
              <p className="font-semi-normal text-text-grey text-[14px]">
                {subscription?.event_creation} monthly
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <TicketIcon />
              <p className="font-semi-normal text-[14px]">Ticket sales commission</p>
            </div>
            {subscription?.sales_commission === 0 ? (
              <p className="font-semi-normal text-text-grey text-[14px]">None</p>
            ) : (
              <p className="font-semi-normal text-text-grey text-[14px]">
                {subscription?.sales_commission}%
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <BagIcon />
              <p className="font-semi-normal text-[14px]">Service commission</p>
            </div>
            {subscription?.service_commission === 0 ? (
              <p className="font-semi-normal text-text-grey text-[14px]">None</p>
            ) : (
              <p className="font-semi-normal text-text-grey text-[14px]">
                {subscription?.service_commission}%
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <WebIcon />
              <p className="font-semi-normal text-[14px]">Connection range</p>
            </div>
            <p className="font-semi-normal text-text-grey text-[14px]">
              {subscription.connection_range}
            </p>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <ReferralIcon />
              <p className="font-semi-normal text-[14px]">Offline benefits</p>
            </div>
            {subscription?.offline_benefits ? <CheckIcon /> : <PadlockIcon />}
          </div>
        </div>
      </div>
      <Button
        className={`mt-14 h-12 rounded-xl border p-3.5 px-[70px] shadow-none ${!active ? "bg-gradient-green" : "border-light-grey-70 bg-light-grey-70"}`}
      >
        {!active ? (
          <p
            className="font-semi-normal text-[16px]"
            onClick={() => handleSubscribe(subscription.id, subscription)}
          >
            Subscribe
          </p>
        ) : (
          <p className="font-semi-normal text-text-grey text-[16px]">Current plan</p>
        )}
      </Button>
    </div>
  );
};

export default PricingCard;
