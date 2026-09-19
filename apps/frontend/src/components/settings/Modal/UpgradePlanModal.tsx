import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { FormikButton } from "@/components/global/FormikButton";
import {
  Label,
  Input,
  Dialog,
  DialogContentBare,
  DialogTitle,
} from "@lemonade/ui";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useChangePlanMutation } from "@/features/authentication/mutations";
import * as yup from "yup";

interface UpgradePlanProps {
  isOpen: boolean;
  toggle: () => void;
  sub_id: number | null;
  subMode: string | null;
  pricing: any[];
}

const UpgradePlanModal = ({
  isOpen,
  toggle,
  sub_id,
  subMode,
  pricing,
}: UpgradePlanProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const [subType, setSubType] = useState<string | null>("");
  const changePlanMutation = useChangePlanMutation();
  const upgradeLoading = changePlanMutation.isPending;

  const handleSelectedPlan = (membership: { id: number; type: string }) => {
    setSelected((prevSelected) =>
      prevSelected === membership.id ? null : membership.id,
    );

    setSubType((prevSelected) =>
      selected === membership.id ? null : membership.type,
    );
  };

  const handleSubUpgrade = async () => {
    if (!selected) {
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Please select a plan",
          type: "error",
        }),
      );
      return;
    }
    const data = {
      reason: "upgrading",
      subscription_id: sub_id,
      type: subType,
      mode: subMode,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/plan`,
    };

    changePlanMutation.mutate(data, {
      onSuccess: (result) => {
        toggle();
        if (result.payment) {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Redirecting to payment gateway",
              type: "success",
            }),
          );
          window.location.href = result.payment;
        } else {
          // A free-plan switch applies immediately server-side —
          // no payment redirect needed (the old code treated this
          // branch as an error even on a real success).
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Plan updated successfully",
              type: "success",
            }),
          );
        }
      },
      onError: (error: any) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message:
              error?.message || "Something went wrong. Please try again!!!",
            type: "error",
          }),
        );
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Membership</DialogTitle>
        <form>
          <div className="w-[640px] rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="cursor-pointer" onClick={toggle}>
                  <CloseIcon />
                </div>
                <p className="font-sans font-semibold leading-[27px] tracking-custom text-[18p]">
                  Membership
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleSubUpgrade}
                  disabled={!selected || upgradeLoading}
                  className={`flex h-[39px] w-fit items-center justify-center gap-2 rounded-xl px-4 py-2 font-sans text-[16px] font-medium text-white transition-all duration-300 ${
                    selected && !upgradeLoading
                      ? "border border-step-color bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong"
                      : "cursor-not-allowed bg-mid-green opacity-70"
                  }`}
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
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Pay now</span>
                  )}
                </button>
              </div>
            </div>
            <div className="mt-10">
              <div className={"flex flex-col gap-[16px]"}>
                {pricing?.map((membership: any) => (
                  <div
                    className={`cursor-pointer rounded-[12px] p-[16px] ${selected === membership.id ? "border-[1px] border-step-color bg-light-green-10" : "bg-mid-grey"}`}
                    key={membership.id}
                    onClick={() => handleSelectedPlan(membership)}
                  >
                    <div className={"flex items-center justify-between"}>
                      <p
                        className={"text-[16px] font-semiBold text-black-light"}
                      >
                        {membership.title}
                      </p>
                      <p
                        className={"text-[16px] font-semiBold text-black-light"}
                      >
                        ₦{formatNumberWithCommas(membership.amount)}/
                        {membership.pay_by}
                      </p>
                    </div>
                    <p className={"text-[14px] font-normal text-text-grey"}>
                      Billed {membership.type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default UpgradePlanModal;
