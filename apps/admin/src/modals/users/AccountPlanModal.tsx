"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import { PrinterIcon, XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { useAccountPlanQuery } from "@/features/user/queries";
import { useCancelPlanMutation, useChangePlanMutation } from "@/features/user/mutations";
import { useSubscriptionPlanListQuery } from "@/features/subscriptions/queries";
import { manualTransactionsExport } from "@/utils/helper";

interface AccountPlanModalProps {
  isOpen: boolean;
  toggle: () => void;
  id: string;
}

type Step = "plan" | "cancel" | "change";

const naira = (value: string) =>
  `₦${Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

// The user's plan, card and payments, with cancel-renewal and change-plan.
function AccountPlanModal({ isOpen, toggle, id }: AccountPlanModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useAccountPlanQuery(id, { enabled: isLoggedIn && isOpen });
  const { data: plansData } = useSubscriptionPlanListQuery({ enabled: isLoggedIn && isOpen });
  const cancelMutation = useCancelPlanMutation(id);
  const changeMutation = useChangePlanMutation(id);
  const [step, setStep] = useState<Step>("plan");
  const [planId, setPlanId] = useState("");

  const current = data?.current ?? null;
  const history = data?.subscription_history ?? [];
  const plans = (plansData?.plans ?? []).filter((plan) => plan.active);
  const selectedPlan = planId || plans[0]?.id || "";

  const close = () => {
    setStep("plan");
    toggle();
  };

  const done = (message: string) => {
    dispatch(updateToastifyReducer({ show: true, message: apiMessage(message), type: "success" }));
    setStep("plan");
  };

  const fail = (error: Error) =>
    dispatch(
      updateToastifyReducer({
        show: true,
        message: error?.message || "Something went wrong",
        type: "error",
      }),
    );

  const cancelRenewal = () =>
    cancelMutation.mutate(undefined, {
      onSuccess: () => done("Subscription cancelled"),
      onError: fail,
    });

  const changePlan = () =>
    changeMutation.mutate(
      { subscription_id: selectedPlan },
      { onSuccess: () => done("Plan changed"), onError: fail },
    );

  const print = () =>
    manualTransactionsExport(
      history.map((item) => ({
        transaction: item.txn_id,
        plan: item.name,
        date: dayjs(item.created_at).format("DD MMM, YYYY"),
        amount: item.amount,
      })),
      "plan-history",
    );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Account plan</DialogTitle>
        {step === "plan" && (
          <div className="flex max-h-[90vh] w-160 max-w-[94vw] flex-col overflow-y-auto rounded-xl bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-body-l font-sans font-semibold">Account plan</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="border-light-grey-50 flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2"
                  onClick={print}
                  disabled={history.length === 0}
                >
                  <PrinterIcon className="w-4" />
                  <span className="text-body-s font-medium">Print</span>
                </button>
                <button type="button" aria-label="Close" className="cursor-pointer" onClick={close}>
                  <XIcon />
                </button>
              </div>
            </div>

            {current ? (
              <div className="bg-light-green-10 border-b-light-green mt-6 flex items-start justify-between rounded-xl border-b-4 p-4">
                <div className="flex flex-col gap-2">
                  <p className="text-meta text-light-green font-semibold uppercase">
                    {current.title ?? current.type}
                  </p>
                  <p className="text-title-l font-semibold">
                    {naira(current.amount)}/{current.type === "yearly" ? "Yr" : "Mo"}
                  </p>
                  {current.renews_at && (
                    <p className="bg-light-green-20 w-fit rounded-md px-2 py-1 text-xs">
                      {current.auto_renew ? "Renews" : "Ends"}{" "}
                      {dayjs(current.renews_at).format("MMM DD, YYYY")}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {current.auto_renew && current.amount_minor > 0 && (
                    <button
                      type="button"
                      className="border-light-grey-50 text-red-1 cursor-pointer rounded-xl border bg-white px-3 py-2 text-sm font-medium"
                      onClick={() => setStep("cancel")}
                    >
                      Cancel renewal
                    </button>
                  )}
                  <button
                    type="button"
                    className="border-light-grey-50 cursor-pointer rounded-xl border bg-white px-3 py-2 text-sm font-medium"
                    onClick={() => setStep("change")}
                  >
                    Change plan
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-text-grey text-body-s mt-6 font-normal">No active plan.</p>
            )}

            {current?.card && (
              <>
                <p className="text-body-s mt-6 font-medium">Payment info</p>
                <p className="bg-light-green-10 mt-2 w-fit rounded-lg px-3 py-2 text-sm font-medium">
                  {current.card.brand ? `${current.card.brand} ` : ""}***{current.card.last4}
                </p>
              </>
            )}

            <p className="text-body-s mt-6 font-medium">Payment history</p>
            <div className="mt-2 flex flex-col">
              {history.length > 0 ? (
                history.map((item) => (
                  <div
                    className="border-b-grey-20 grid grid-cols-4 border-b py-3 text-sm"
                    key={item.id}
                  >
                    <span>{item.txn_id}</span>
                    <span className="font-semibold">{item.name}</span>
                    <span>{dayjs(item.created_at).format("DD MMM, YYYY")}</span>
                    <span className="text-right">{naira(item.amount)}</span>
                  </div>
                ))
              ) : (
                <p className="text-text-grey text-body-s font-normal">No payments yet.</p>
              )}
            </div>
          </div>
        )}

        {step === "cancel" && (
          <div className="w-90 max-w-[92vw] rounded-xl bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">Cancel subscription</p>
              <button type="button" aria-label="Close" onClick={close}>
                <XIcon />
              </button>
            </div>
            <p className="text-light-black text-body-s mt-4 font-normal">
              This user&apos;s plan will be canceled and their account plan will be changed at the
              end of the current billing cycle.
            </p>
            <div className="mt-4 flex gap-2.5">
              <button
                className="border-light-grey-50 h-12 w-full rounded-xl border bg-white"
                onClick={() => setStep("plan")}
              >
                <p className="text-body-l font-medium text-black">Cancel</p>
              </button>
              <button
                className="border-step-color bg-gradient-green h-12 w-full rounded-xl border disabled:opacity-60"
                onClick={cancelRenewal}
                disabled={cancelMutation.isPending}
              >
                <p className="text-body-l font-medium text-white">Confirm</p>
              </button>
            </div>
          </div>
        )}

        {step === "change" && (
          <div className="w-90 max-w-[92vw] rounded-xl bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">Change plan</p>
              <button type="button" aria-label="Close" onClick={close}>
                <XIcon />
              </button>
            </div>
            <label htmlFor="plan-select" className="text-text-grey text-meta mt-4 block">
              Select plan
            </label>
            <select
              id="plan-select"
              className="bg-light-grey mt-1 w-full rounded-xl p-3"
              value={selectedPlan}
              onChange={(event) => setPlanId(event.target.value)}
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.title}
                </option>
              ))}
            </select>
            <div className="mt-4 flex gap-2.5">
              <button
                className="border-light-grey-50 h-12 w-full rounded-xl border bg-white"
                onClick={() => setStep("plan")}
              >
                <p className="text-body-l font-medium text-black">Cancel</p>
              </button>
              <button
                className="border-step-color bg-gradient-green h-12 w-full rounded-xl border disabled:opacity-60"
                onClick={changePlan}
                disabled={changeMutation.isPending || !selectedPlan}
              >
                <p className="text-body-l font-medium text-white">Confirm</p>
              </button>
            </div>
          </div>
        )}
      </DialogContentBare>
    </Dialog>
  );
}

export default AccountPlanModal;
