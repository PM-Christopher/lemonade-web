"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { PencilIcon, PlusIcon } from "lucide-react";
import { Button } from "@lemonade/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";
import { useSubscriptionPlanListQuery } from "@/features/subscriptions/queries";
import type { AdminSubscriptionPlan } from "@/features/subscriptions/api";
import type { PlanAction } from "@/modals/subscriptions/ConfirmPlanActionModal";

const headers = [
  "Title",
  "Access type",
  "Monthly charge",
  "Yearly charge",
  "Status",
  "Subscribers",
  "Actions",
];

// Off the initial bundle — only needed once a modal is opened, matching
// features/events/add-promotions's lazy-load convention.
const PlanFormModal = dynamic(() => import("@/modals/subscriptions/PlanFormModal"), {
  ssr: false,
});
const ConfirmPlanActionModal = dynamic(
  () => import("@/modals/subscriptions/ConfirmPlanActionModal"),
  { ssr: false },
);

function SubscriptionsClient() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: planData } = useSubscriptionPlanListQuery({ enabled: isLoggedIn });

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<AdminSubscriptionPlan | undefined>(undefined);

  const [confirmAction, setConfirmAction] = useState<PlanAction | null>(null);
  const [confirmPlan, setConfirmPlan] = useState<AdminSubscriptionPlan | undefined>(undefined);

  const openCreateModal = () => {
    setSelectedPlan(undefined);
    setFormModalOpen(true);
  };

  const openEditModal = (plan: AdminSubscriptionPlan) => {
    setSelectedPlan(plan);
    setFormModalOpen(true);
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    setSelectedPlan(undefined);
  };

  const openConfirmModal = (plan: AdminSubscriptionPlan, action: PlanAction) => {
    setConfirmPlan(plan);
    setConfirmAction(action);
  };

  const closeConfirmModal = () => {
    setConfirmAction(null);
    setConfirmPlan(undefined);
  };

  const plans = planData?.plans ?? [];

  return (
    <MainLayout>
      <section className="mt-[24px] flex flex-col gap-[20px]">
        <div className={"flex justify-between px-[20px]"}>
          <p className={"text-[16px] font-semiBold"}>{plans.length} Plans</p>
          <div>
            <Button
              className={"flex h-[40px] rounded-[12px] border-step-color bg-gradient-green"}
              onClick={openCreateModal}
            >
              <PlusIcon className={"h-[15px] w-[15px] text-white"} />
              <p className={"text-[16px] font-medium text-white"}>Create plan</p>
            </Button>
          </div>
        </div>
        <div className={"flex flex-col px-[20px]"}>
          <div className={"flex flex-col rounded-[12px] border-[1px] border-grey-20"}>
            <div className="rounded-lg bg-white shadow-md">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-mid-grey">
                    {headers.map((header) => (
                      <th
                        className="p-4 text-left text-[12px] font-semiBold text-text-grey"
                        key={header}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plans.length > 0 ? (
                    plans.map((plan) => (
                      <tr key={plan.id} className="h-[72px] border-b border-grey-20">
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          <div className="flex items-center gap-2">
                            {plan.title}
                            {plan.recommended && (
                              <span className="rounded-full bg-light-green-10 px-2 py-[2px] text-[11px] font-semiBold text-light-green">
                                Recommended
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>{plan.access_type}</td>
                        {/* Pre-formatted display strings from the backend — never
                            reformatted or recomputed here, per CLAUDE.md's money rule. */}
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {plan.monthly_charge}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {plan.yearly_charge}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          <span
                            className={
                              plan.active ? "text-light-green-70" : "text-red-1"
                            }
                          >
                            {plan.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {plan.subscriber_count ?? 0}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          <div className="flex items-center gap-[12px]">
                            <button
                              type="button"
                              className="text-text-grey"
                              onClick={() => openEditModal(plan)}
                              aria-label={`Edit ${plan.title}`}
                            >
                              <PencilIcon className="h-[16px] w-[16px]" />
                            </button>
                            {plan.active ? (
                              <button
                                type="button"
                                className="text-[13px] font-medium text-red-1"
                                onClick={() => openConfirmModal(plan, "deactivate")}
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="text-[13px] font-medium text-light-green-70"
                                onClick={() => openConfirmModal(plan, "activate")}
                              >
                                Activate
                              </button>
                            )}
                            <button
                              type="button"
                              className="text-[13px] font-medium text-red-1"
                              onClick={() => openConfirmModal(plan, "delete")}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={headers.length} className="p-4 text-center text-sm text-gray-500">
                        No plans yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <PlanFormModal isOpen={formModalOpen} toggle={closeFormModal} plan={selectedPlan} />
      {confirmAction && (
        <ConfirmPlanActionModal
          isOpen={Boolean(confirmAction)}
          toggle={closeConfirmModal}
          plan={confirmPlan}
          action={confirmAction}
        />
      )}
    </MainLayout>
  );
}

export default SubscriptionsClient;
