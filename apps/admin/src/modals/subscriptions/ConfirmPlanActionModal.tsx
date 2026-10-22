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
import { apiMessage } from "@/lib/api-message";

export type PlanAction = "activate" | "deactivate" | "delete";

interface ConfirmPlanActionModalProps {
  isOpen: boolean;
  toggle: () => void;
  plan?: AdminSubscriptionPlan;
  action: PlanAction;
  // Used by the blocked delete view, for plans that still have members.
  onViewMembers?: (plan: AdminSubscriptionPlan) => void;
  onDeactivate?: (plan: AdminSubscriptionPlan) => void;
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
    body: (planTitle) => `Are you sure you want to delete "${planTitle}"? This can't be undone.`,
    confirmLabel: "Delete",
    danger: true,
  },
};

function ConfirmPlanActionModal({
  isOpen,
  toggle,
  plan,
  action,
  onViewMembers,
  onDeactivate,
}: ConfirmPlanActionModalProps) {
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

  // A plan with members can't be deleted, so explain instead of failing.
  const members = plan?.subscriber_count ?? 0;
  const isBlocked = action === "delete" && members > 0;

  const handleConfirm = () => {
    if (!plan) return;

    mutation.mutate(plan.id, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: apiMessage(`${copy.confirmLabel}d plan successfully`),
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
        <div className="w-90 rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">{copy.title}</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          {isBlocked && plan ? (
            <div className={"flex flex-col gap-4 px-4 py-4"}>
              <p className={"text-light-black text-body-s font-normal"}>
                &quot;{plan.title}&quot; has {members} {members === 1 ? "member" : "members"}, so it
                can&apos;t be deleted. Their billing history stays with the plan.
              </p>
              <p className={"text-text-grey text-body-s font-normal"}>
                {plan.active
                  ? "Deactivate it to stop new sign-ups. Current members keep the plan until it ends."
                  : "It is already deactivated, so no one new can join. Current members keep it until it ends."}
              </p>
              <div className={"flex flex-col gap-2.5"}>
                {plan.active && onDeactivate && (
                  <button
                    type="button"
                    className="border-red-2 bg-red-1 h-12 w-full rounded-xl border text-center"
                    onClick={() => onDeactivate(plan)}
                  >
                    <p className={"text-body-l font-medium text-white"}>Deactivate instead</p>
                  </button>
                )}
                {onViewMembers && (
                  <button
                    type="button"
                    className={"border-light-grey-50 h-12 w-full rounded-xl border bg-white"}
                    onClick={() => onViewMembers(plan)}
                  >
                    <p className={"text-body-l font-medium text-black"}>View members</p>
                  </button>
                )}
                <button
                  type="button"
                  className={"border-light-grey-50 h-12 w-full rounded-xl border bg-white"}
                  onClick={toggle}
                >
                  <p className={"text-body-l font-medium text-black"}>Close</p>
                </button>
              </div>
            </div>
          ) : (
            <div className={"flex flex-col gap-4 px-4 py-4"}>
              <p className={"text-light-black text-body-s font-normal"}>
                {plan ? copy.body(plan.title) : ""}
              </p>
              <div className={"flex justify-between gap-2.5"}>
                <button
                  className={"border-light-grey-50 h-12 w-39 rounded-xl border bg-white"}
                  onClick={toggle}
                >
                  <p className={"text-body-l font-medium text-black"}>Cancel</p>
                </button>
                <button
                  className={
                    copy.danger
                      ? "border-red-2 bg-red-1 h-12 w-39 rounded-xl border text-center"
                      : "border-step-color bg-gradient-green h-12 w-39 rounded-xl border text-center"
                  }
                  onClick={handleConfirm}
                  disabled={mutation.isPending}
                >
                  <p className={"text-body-l font-medium text-white"}>{copy.confirmLabel}</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default ConfirmPlanActionModal;
