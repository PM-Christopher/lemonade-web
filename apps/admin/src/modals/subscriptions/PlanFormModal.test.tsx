import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import PlanFormModal from "./PlanFormModal";
import type { AdminSubscriptionPlan } from "@/features/subscriptions/api";

vi.mock("@/features/subscriptions/mutations", () => ({
  useCreatePlanMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdatePlanMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

const plan = (access_type: "Limited" | "Unlimited"): AdminSubscriptionPlan => ({
  id: "p1",
  title: "Pro",
  access_type,
  monthly_charge_minor: 0,
  monthly_charge: "0.00",
  yearly_charge_minor: 0,
  yearly_charge: "0.00",
  active: true,
  recommended: false,
  created_at: "2026-01-01",
  benefits: {
    verification_badge: true,
    tribe_creation: true,
    business_listing: true,
    lemon_id: true,
    event_creation: 2,
    tribe_limit: 3,
    thread_limit: 10,
    business_limit: 1,
    ticket_sales_commission: 5,
    service_commission: 5,
    connection_range: access_type,
    offline_benefits: true,
  },
});

const open = (value?: AdminSubscriptionPlan) =>
  render(
    <Provider store={configureStore({ reducer: { noop: (state = {}) => state } })}>
      <QueryClientProvider client={new QueryClient()}>
        <PlanFormModal isOpen toggle={vi.fn()} plan={value} />
      </QueryClientProvider>
    </Provider>,
  );

describe("PlanFormModal", () => {
  it("shows the usage limits on a Limited plan", () => {
    open(plan("Limited"));

    expect(screen.getByLabelText("Events per month")).toHaveValue("2");
    expect(screen.getByLabelText("Tribes")).toHaveValue("3");
    expect(screen.getByLabelText("Threads per tribe")).toHaveValue("10");
    expect(screen.getByLabelText("Businesses")).toHaveValue("1");
  });

  it("hides the usage limits on an Unlimited plan", () => {
    open(plan("Unlimited"));

    expect(screen.queryByLabelText("Tribes")).not.toBeInTheDocument();
    expect(screen.getByText("Unlimited plans have no usage limits.")).toBeInTheDocument();
  });
});
