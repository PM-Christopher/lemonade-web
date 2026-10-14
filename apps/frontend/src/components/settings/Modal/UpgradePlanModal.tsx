import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useChangePlanMutation } from "@/features/authentication/mutations";
import { routes } from "@/lib/routes";
import { errorMessage } from "@/lib/api-error";

interface MembershipOption {
  id: number;
  title?: string;
  amount?: number | string;
  pay_by?: string;
  type?: string;
}

interface UpgradePlanProps {
  isOpen: boolean;
  toggle: () => void;
  sub_id: number | null;
  subMode: string | null;
  pricing: MembershipOption[];
}

const UpgradePlanModal = ({ isOpen, toggle, sub_id, subMode, pricing }: UpgradePlanProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const [subType, setSubType] = useState<string | null>("");
  const changePlanMutation = useChangePlanMutation();
  const upgradeLoading = changePlanMutation.isPending;

  const handleSelectedPlan = (membership: MembershipOption) => {
    setSelected((prevSelected) => (prevSelected === membership.id ? null : membership.id));

    setSubType(selected === membership.id ? null : (membership.type ?? null));
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
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}${routes.SETTINGS_PLAN}`,
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
          // A free-plan switch applies immediately, with no payment step.
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Plan updated successfully",
              type: "success",
            }),
          );
        }
      },
      onError: (error) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "Something went wrong. Please try again."),
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
          <div className="w-160 rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Close"
                  className="cursor-pointer"
                  onClick={toggle}
                >
                  <CloseIcon />
                </button>
                <p className="tracking-custom font-sans text-lg leading-6.75 font-semibold">
                  Membership
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleSubUpgrade}
                  disabled={!selected || upgradeLoading}
                  className={`text-body-l flex h-9.75 w-fit items-center justify-center gap-2 rounded-xl px-4 py-2 font-sans font-medium text-white transition-all duration-300 ${
                    selected && !upgradeLoading
                      ? "border-step-color bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong border"
                      : "bg-mid-green cursor-not-allowed opacity-70"
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
              <div className={"flex flex-col gap-4"}>
                {pricing?.map((membership) => (
                  <button
                    type="button"
                    aria-pressed={selected === membership.id}
                    className={`w-full cursor-pointer rounded-xl p-4 text-left ${selected === membership.id ? "border-step-color bg-light-green-10 border" : "bg-mid-grey"}`}
                    key={membership.id}
                    onClick={() => handleSelectedPlan(membership)}
                  >
                    <div className={"flex items-center justify-between"}>
                      <p className={"font-semiBold text-black-light text-body-l"}>
                        {membership.title}
                      </p>
                      <p className={"font-semiBold text-black-light text-body-l"}>
                        ₦{formatNumberWithCommas(Number(membership.amount))}/{membership.pay_by}
                      </p>
                    </div>
                    <p className={"text-text-grey text-body-s font-normal"}>
                      Billed {membership.type}
                    </p>
                  </button>
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
