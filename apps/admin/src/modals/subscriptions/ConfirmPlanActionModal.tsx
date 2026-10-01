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
        <div className="w-[360px] rounded-[12px] bg-white pt-[16px] pb-[4px]">
          <div className={"px-[16px] py-[4px]"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] leading-[27px] font-semibold">{copy.title}</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-[16px] px-[16px] py-[16px]"}>
            <p className={"text-light-black text-[14px] font-normal"}>
              {plan ? copy.body(plan.title) : ""}
            </p>
            <div className={"flex justify-between gap-[10px]"}>
              <button
                className={
                  "border-light-grey-50 h-[48px] w-[156px] rounded-[12px] border-[1px] bg-white"
                }
                onClick={toggle}
              >
                <p className={"text-[16px] font-medium text-black"}>Cancel</p>
              </button>
              <button
                className={
                  copy.danger
                    ? "border-red-2 bg-red-1 h-[48px] w-[156px] rounded-[12px] border-[1px] text-center"
                    : "border-step-color bg-gradient-green h-[48px] w-[156px] rounded-[12px] border-[1px] text-center"
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
