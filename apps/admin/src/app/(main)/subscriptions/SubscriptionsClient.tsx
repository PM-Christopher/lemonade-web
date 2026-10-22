"use client";
import React, { useState } from "react";
import { ActionMenu } from "@/components/global/ActionMenu";
import { centerNumericColumns } from "@/utils/tableAlign";
import { PlusIcon } from "lucide-react";
import { Button } from "@lemonade/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";
import {
  useSubscriptionOverviewQuery,
  useSubscriptionPlanListQuery,
} from "@/features/subscriptions/queries";
import DataCard from "@/components/global/DataCard";
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
const PlanSubscribersModal = dynamic(() => import("@/modals/subscriptions/PlanSubscribersModal"), {
  ssr: false,
});
const ConfirmPlanActionModal = dynamic(
  () => import("@/modals/subscriptions/ConfirmPlanActionModal"),
  { ssr: false },
);

function SubscriptionsClient() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: planData } = useSubscriptionPlanListQuery({ enabled: isLoggedIn });
  const { data: overview } = useSubscriptionOverviewQuery({ enabled: isLoggedIn });
  const [subscribersPlan, setSubscribersPlan] = useState<AdminSubscriptionPlan | undefined>();

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
    <>
      <section className="mt-6 flex flex-col gap-5">
        <div className={"flex justify-between px-5"}>
          <p className={"font-semiBold text-body-l"}>{plans.length} Plans</p>
          <div>
            <Button
              className={"border-step-color bg-gradient-green flex h-10 rounded-xl"}
              onClick={openCreateModal}
            >
              <PlusIcon className={"h-3.75 w-3.75 text-white"} />
              <p className={"text-body-l font-medium text-white"}>Create plan</p>
            </Button>
          </div>
        </div>
        <div className={"flex gap-6 px-5"}>
          <DataCard
            styles={"w-full"}
            title={"Total Subscribers"}
            count={overview?.total_subscribers ?? 0}
          />
          <div className={"shadow-card-shadow flex w-full flex-col gap-4 rounded-xl bg-white p-4"}>
            <p className="text-text-grey text-body-s font-normal">Recurring Revenue</p>
            <p className="font-semiBold text-title-l leading-normal">
              ₦{Number(overview?.total_recurring_revenue ?? 0).toLocaleString("en-US")}
            </p>
          </div>
        </div>
        <div className={"flex flex-col px-5"}>
          <div className={"border-grey-20 flex flex-col rounded-xl border"}>
            <div className="rounded-lg bg-white shadow-md">
              <table
                className={`min-w-full table-auto border-collapse ${centerNumericColumns(headers)}`}
              >
                <thead>
                  <tr className="bg-mid-grey">
                    {headers.map((header) => (
                      <th
                        className="font-semiBold text-text-grey text-meta p-4 text-left leading-normal"
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
                      <tr key={plan.id} className="border-grey-20 h-18 border-b">
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          <div className="flex items-center gap-2">
                            {plan.title}
                            {plan.recommended && (
                              <span className="bg-light-green-10 font-semiBold text-light-green text-meta rounded-full px-2 py-0.5 leading-normal">
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
                          <span className={plan.active ? "text-light-green-70" : "text-red-1"}>
                            {plan.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          <button
                            type="button"
                            className="text-light-green underline"
                            onClick={() => setSubscribersPlan(plan)}
                          >
                            {plan.subscriber_count ?? 0}
                          </button>
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          <ActionMenu
                            label={`Actions for ${plan.title}`}
                            items={[
                              { label: "Edit", onSelect: () => openEditModal(plan) },
                              plan.active
                                ? {
                                    label: "Deactivate",
                                    onSelect: () => openConfirmModal(plan, "deactivate"),
                                  }
                                : {
                                    label: "Activate",
                                    onSelect: () => openConfirmModal(plan, "activate"),
                                  },
                              {
                                label: "View members",
                                onSelect: () => setSubscribersPlan(plan),
                              },
                              {
                                label: "Delete",
                                danger: true,
                                onSelect: () => openConfirmModal(plan, "delete"),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={headers.length}
                        className="p-4 text-center text-sm text-gray-500"
                      >
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

      <PlanSubscribersModal
        isOpen={subscribersPlan !== undefined}
        toggle={() => setSubscribersPlan(undefined)}
        planId={subscribersPlan?.id}
        planTitle={subscribersPlan?.title}
      />
      <PlanFormModal isOpen={formModalOpen} toggle={closeFormModal} plan={selectedPlan} />
      {confirmAction && (
        <ConfirmPlanActionModal
          isOpen={Boolean(confirmAction)}
          toggle={closeConfirmModal}
          plan={confirmPlan}
          action={confirmAction}
          onViewMembers={(plan) => {
            closeConfirmModal();
            setSubscribersPlan(plan);
          }}
          onDeactivate={(plan) => openConfirmModal(plan, "deactivate")}
        />
      )}
    </>
  );
}

export default SubscriptionsClient;
