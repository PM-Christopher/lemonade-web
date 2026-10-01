import React from "react";
import { Button } from "@lemonade/ui";
import { useSelector } from "react-redux";
import CheckIcon from "@/images/icons/checkGreenIcon.svg";
import PadlockIcon from "@/images/icons/padlockFilledIcon.svg";
import { RootState } from "@/redux/store";
import { clearReason } from "@/features/authentication/authSlice";
import { useChangePlanMutation } from "@/features/authentication/mutations";
import { useAppDispatch } from "@/redux/hook";
import { cancelReason } from "../../../../pageData";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useRouter } from "next/navigation";

const CancelSection = ({}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { plan, subscription, downgradeData } = useSelector((state: RootState) => state.auth);
  const changePlanMutation = useChangePlanMutation();
  const upgradeLoading = changePlanMutation.isPending;

  const downgradePlan = async () => {
    const findReason = cancelReason.find((item) => item.value === downgradeData?.reason);
    if (!findReason) {
      throw new Error("Reason not found");
    }

    const data = {
      reason: findReason.label,
      subscription_id: downgradeData?.sub_id,
      type: "monthly",
      mode: "downgrade",
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/plan`,
    };
    changePlanMutation.mutate(data, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Successful",
            type: "success",
          }),
        );
        dispatch(clearReason());
        router.push("/settings/plan");
      },
      onError: (error: any) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || "An error occurred.",
            type: "error",
          }),
        );
      },
    });
  };

  return (
    <div className="laptop:w-[640px] flex w-full flex-col gap-4 rounded-[12px] bg-white p-[24px]">
      <div>
        <p className="text-[20px] font-semibold">We are sorry to see you go</p>
        <p className="text-light-black text-[14px] font-normal">
          You will lose the following plan benefits if you downgrade
        </p>
      </div>
      <div className="bg-mid-grey flex flex-col gap-[16px] rounded-[12px] p-[24px]">
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-[14px]">Verification badge</p>
          {subscription?.benefits?.ver_badge ? <CheckIcon /> : <PadlockIcon />}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-[14px]">Tribe creation</p>
          {subscription?.benefits?.forum_creation ? <CheckIcon /> : <PadlockIcon />}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-[14px]">Lemon ID</p>
          {subscription?.benefits?.lemon_id ? <CheckIcon /> : <PadlockIcon />}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-[14px]">Event creation</p>
          {subscription?.benefits?.event_creation === 0 ? (
            <p className="font-semi-normal text-text-grey text-[14px]">Unlimited</p>
          ) : (
            <p className="font-semi-normal text-text-grey text-[14px]">
              {subscription?.benefits?.event_creation} monthly
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-[14px]">Ticket sales commission</p>
          {subscription?.benefits?.sales_commission === 0 ? (
            <p className="font-semi-normal text-text-grey text-[14px]">None</p>
          ) : (
            <p className="font-semi-normal text-text-grey text-[14px]">
              {subscription?.benefits?.sales_commission}%
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-[14px]">Service commission</p>
          {subscription?.benefits?.service_commission === 0 ? (
            <p className="font-semi-normal text-text-grey text-[14px]">None</p>
          ) : (
            <p className="font-semi-normal text-text-grey text-[14px]">
              {subscription?.benefits?.service_commission}%
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-[14px]">Connection range</p>
          <p className="font-semi-normal text-text-grey text-[14px]">
            {subscription?.benefits?.connection_range}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-[14px]">Offline benefits</p>
          {subscription?.benefits?.offline_benefits ? <CheckIcon /> : <PadlockIcon />}
        </div>
      </div>
      <div className="laptop:flex-row mt-[24px] flex flex-col justify-between gap-[16px]">
        <Button
          className={`h-[48px] w-full rounded-[12px] ${
            !upgradeLoading
              ? "border-step-color bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong border"
              : "bg-mid-green cursor-not-allowed opacity-70"
          } `}
          onClick={downgradePlan}
        >
          {upgradeLoading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <p className="font-semi-normal text-[16px]">Loading...</p>
            </>
          ) : (
            <p className="font-semi-normal text-[16px]">Continue to downgrade</p>
          )}
        </Button>
        <Button className="h-[48px] w-full rounded-[12px] border-[1px] bg-white shadow-none hover:bg-white">
          <p className="font-semi-normal text-black-light text-[16px]">Keep my current plan</p>
        </Button>
      </div>
    </div>
  );
};

export default CancelSection;
