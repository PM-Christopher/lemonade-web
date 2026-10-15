import { appUrl } from "@/lib/app-url";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
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

const CancelSection = ({}) => {
  const dispatch = useAppDispatch();
  const { push } = useNavigation();
  const { subscription, downgradeData } = useSelector((state: RootState) => state.auth);
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
      redirect_url: appUrl(routes.SETTINGS_PLAN),
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
        push(routes.SETTINGS_PLAN);
      },
      onError: (error: { message?: string }) => {
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
    <div className="laptop:w-160 flex w-full flex-col gap-4 rounded-xl bg-white p-6">
      <div>
        <p className="text-title-r leading-normal font-semibold">We are sorry to see you go</p>
        <p className="text-light-black text-body-s font-normal">
          You will lose the following plan benefits if you downgrade
        </p>
      </div>
      <div className="bg-mid-grey flex flex-col gap-4 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-body-s">Verification badge</p>
          {subscription?.benefits?.ver_badge ? <CheckIcon /> : <PadlockIcon />}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-body-s">Tribe creation</p>
          {subscription?.benefits?.forum_creation ? <CheckIcon /> : <PadlockIcon />}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-body-s">Lemon ID</p>
          {subscription?.benefits?.lemon_id ? <CheckIcon /> : <PadlockIcon />}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-body-s">Event creation</p>
          {subscription?.benefits?.event_creation === 0 ? (
            <p className="font-semi-normal text-text-grey text-body-s">Unlimited</p>
          ) : (
            <p className="font-semi-normal text-text-grey text-body-s">
              {subscription?.benefits?.event_creation} monthly
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-body-s">Ticket sales commission</p>
          {subscription?.benefits?.sales_commission === 0 ? (
            <p className="font-semi-normal text-text-grey text-body-s">None</p>
          ) : (
            <p className="font-semi-normal text-text-grey text-body-s">
              {subscription?.benefits?.sales_commission}%
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-body-s">Service commission</p>
          {subscription?.benefits?.service_commission === 0 ? (
            <p className="font-semi-normal text-text-grey text-body-s">None</p>
          ) : (
            <p className="font-semi-normal text-text-grey text-body-s">
              {subscription?.benefits?.service_commission}%
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-body-s">Connection range</p>
          <p className="font-semi-normal text-text-grey text-body-s">
            {subscription?.benefits?.connection_range}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semi-normal text-black-light text-body-s">Offline benefits</p>
          {subscription?.benefits?.offline_benefits ? <CheckIcon /> : <PadlockIcon />}
        </div>
      </div>
      <div className="laptop:flex-row mt-6 flex flex-col justify-between gap-4">
        <Button
          className={`h-12 w-full rounded-xl ${
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
              <p className="font-semi-normal text-body-l">Loading...</p>
            </>
          ) : (
            <p className="font-semi-normal text-body-l">Continue to downgrade</p>
          )}
        </Button>
        <Button className="h-12 w-full rounded-xl border bg-white shadow-none hover:bg-white">
          <p className="font-semi-normal text-black-light text-body-l">Keep my current plan</p>
        </Button>
      </div>
    </div>
  );
};

export default CancelSection;
