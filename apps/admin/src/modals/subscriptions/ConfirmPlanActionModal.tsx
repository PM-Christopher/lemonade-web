import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import type { AdminSubscriptionPlan } from "@/features/subscriptions/api";
import {
  useActivatePlanMutation,
  useDeactivatePlanMutation,
  useDeletePlanMutation,
} from "@/features/subscriptions/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

export type PlanAction = "activate" | "deactivate" | "delete";

interface ConfirmPlanActionModalProps {
  isOpen: boolean;
  toggle: () => void;
  plan?: AdminSubscriptionPlan;
  action: PlanAction;
}

const COPY: Record<
  PlanAction,
  { title: string; body: (planTitle: string) => string; confirmLabel: string; danger: boolean }
> = {
  activate: {
    title: "Activate plan",
    body: (planTitle) =>
      `Are you sure you want to activate "${planTitle}"? It becomes visible in the catalogue and open to new subscribers.`,
    confirmLabel: "Activate",
    danger: false,
  },
  deactivate: {
    title: "Deactivate plan",
    body: (planTitle) =>
      `Are you sure you want to deactivate "${planTitle}"? It's hidden from the catalogue — anyone already subscribed keeps their current term.`,
    confirmLabel: "Deactivate",
    danger: true,
  },
  delete: {
    title: "Delete plan",
    body: (planTitle) =>
      `Are you sure you want to delete "${planTitle}"? This can't be undone. Plans with subscribers can't be deleted — deactivate those instead.`,
    confirmLabel: "Delete",
    danger: true,
  },
};

function ConfirmPlanActionModal({ isOpen, toggle, plan, action }: ConfirmPlanActionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const activatePlanMutation = useActivatePlanMutation();
  const deactivatePlanMutation = useDeactivatePlanMutation();
  const deletePlanMutation = useDeletePlanMutation();

  const copy = COPY[action];
  const mutation =
    action === "activate"
      ? activatePlanMutation
      : action === "deactivate"
        ? deactivatePlanMutation
        : deletePlanMutation;

  const handleConfirm = () => {
    if (!plan) return;

    mutation.mutate(plan.id, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: `${copy.confirmLabel}d plan successfully`,
            type: "success",
          }),
        );
        toggle();
      },
      onError: (error) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || "Something went wrong",
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
        <DialogTitle className="sr-only">{copy.title}</DialogTitle>
        <div className="w-[360px] rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] leading-[27px] font-semibold">{copy.title}</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            <p className={"text-light-black text-[14px] font-normal"}>
              {plan ? copy.body(plan.title) : ""}
            </p>
            <div className={"flex justify-between gap-2.5"}>
              <button
                className={"border-light-grey-50 h-12 w-[156px] rounded-xl border bg-white"}
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={
                  copy.danger
                    ? "border-red-2 bg-red-1 h-12 w-[156px] rounded-xl border text-center"
                    : "border-step-color bg-gradient-green h-12 w-[156px] rounded-xl border text-center"
                }
                onClick={handleConfirm}
                disabled={mutation.isPending}
              >
                <p className={"text-[16px] font-medium text-white"}>{copy.confirmLabel}</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default ConfirmPlanActionModal;
