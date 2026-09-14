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
import { Button } from "@/components/ui/button";
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
        className="w-[260px] rounded-tl-[16px] rounded-tr-[16px] px-[48px] pt-[16px]"
        style={{ background: `${active ? "url('/images/pricingbg.png')" : "#F4F4F6"}` }}
      >
        <p className="text-center font-ruso text-[20px] font-normal">{subscription?.title}</p>
        <p className="text-center text-[16px] font-normal text-light-black">
          {subscription?.access_type} access
        </p>
      </div>
      <div
        className={`w-[311px] rounded-[12px] border-[2px] ${active ? "border-step-color" : "border-light-grey-60"}`}
      >
        <div
          className={`rounded-tl-[12px] rounded-tr-[12px] ${active ? "bg-step-color" : "bg-grey-20"}`}
        >
          {subscription?.monthly_charge === 0 ? (
            <p className="p-[12px] text-[16px] font-semibold">Free forever</p>
          ) : (
            <p className="p-[12px] text-[16px] font-semibold">
              N{subscription?.monthly_charge}/month
            </p>
          )}
        </div>
        <div className="flex flex-col gap-[20px] rounded-bl-[12px] rounded-br-[12px] bg-white p-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <VerIcon />
              <p className="text-[14px] font-semi-normal">Verification badge</p>
            </div>
            {subscription?.ver_badge ? <CheckIcon /> : <PadlockIcon />}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <ChatIcon />
              <p className="text-[14px] font-semi-normal">Tribe creation</p>
            </div>
            {subscription?.forum_creation ? <CheckIcon /> : <PadlockIcon />}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <LemonIcon />
              <p className="text-[14px] font-semi-normal">Lemon ID</p>
            </div>
            {subscription?.lemon_id ? <CheckIcon /> : <PadlockIcon />}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <p className="text-[14px] font-semi-normal">Event creation</p>
            </div>
            {subscription?.event_creation === 0 ? (
              <p className="text-[14px] font-semi-normal text-text-grey">Unlimited</p>
            ) : (
              <p className="text-[14px] font-semi-normal text-text-grey">
                {subscription?.event_creation} monthly
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <TicketIcon />
              <p className="text-[14px] font-semi-normal">Ticket sales commission</p>
            </div>
            {subscription?.sales_commission === 0 ? (
              <p className="text-[14px] font-semi-normal text-text-grey">None</p>
            ) : (
              <p className="text-[14px] font-semi-normal text-text-grey">
                {subscription?.sales_commission}%
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <BagIcon />
              <p className="text-[14px] font-semi-normal">Service commission</p>
            </div>
            {subscription?.service_commission === 0 ? (
              <p className="text-[14px] font-semi-normal text-text-grey">None</p>
            ) : (
              <p className="text-[14px] font-semi-normal text-text-grey">
                {subscription?.service_commission}%
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <WebIcon />
              <p className="text-[14px] font-semi-normal">Connection range</p>
            </div>
            <p className="text-[14px] font-semi-normal text-text-grey">
              {subscription.connection_range}
            </p>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <ReferralIcon />
              <p className="text-[14px] font-semi-normal">Offline benefits</p>
            </div>
            {subscription?.offline_benefits ? <CheckIcon /> : <PadlockIcon />}
          </div>
        </div>
      </div>
      <Button
        className={`mt-[56px] h-[48px] rounded-[12px] border-[1px] p-[14px] px-[70px] shadow-none ${!active ? "bg-gradient-green" : "border-light-grey-70 bg-light-grey-70"}`}
      >
        {!active ? (
          <p
            className="text-[16px] font-semi-normal"
            onClick={() => handleSubscribe(subscription.id, subscription)}
          >
            Subscribe
          </p>
        ) : (
          <p className="text-[16px] font-semi-normal text-text-grey">Current plan</p>
        )}
      </Button>
    </div>
  );
};

export default PricingCard;
