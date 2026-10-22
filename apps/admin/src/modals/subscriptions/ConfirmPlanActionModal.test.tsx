import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ConfirmPlanActionModal from "./ConfirmPlanActionModal";
import type { AdminSubscriptionPlan } from "@/features/subscriptions/api";

const deleteMutate = vi.fn();
vi.mock("@/features/subscriptions/mutations", () => ({
  useActivatePlanMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useDeactivatePlanMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useDeletePlanMutation: () => ({ mutate: deleteMutate, isPending: false }),
}));

const plan = (subscriber_count: number, active = true) =>
  ({ id: "p1", title: "Pro", active, subscriber_count }) as AdminSubscriptionPlan;

const open = (value: AdminSubscriptionPlan, extra = {}) =>
  render(
    <Provider store={configureStore({ reducer: { noop: (state = {}) => state } })}>
      <QueryClientProvider client={new QueryClient()}>
        <ConfirmPlanActionModal isOpen toggle={vi.fn()} plan={value} action="delete" {...extra} />
      </QueryClientProvider>
    </Provider>,
  );

describe("ConfirmPlanActionModal delete", () => {
  it("explains instead of deleting when the plan has members", () => {
    const onDeactivate = vi.fn();
    const onViewMembers = vi.fn();
    open(plan(3), { onDeactivate, onViewMembers });

    expect(screen.getByText(/has 3 members, so it can't be deleted/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Deactivate instead" }));
    expect(onDeactivate).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "View members" }));
    expect(onViewMembers).toHaveBeenCalled();
    expect(deleteMutate).not.toHaveBeenCalled();
  });

  it("does not offer to deactivate a plan that is already inactive", () => {
    open(plan(1, false), { onDeactivate: vi.fn() });

    expect(screen.queryByRole("button", { name: "Deactivate instead" })).not.toBeInTheDocument();
    expect(screen.getByText(/already deactivated/)).toBeInTheDocument();
  });

  it("deletes a plan with no members", () => {
    open(plan(0));

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(deleteMutate).toHaveBeenCalledWith("p1", expect.anything());
  });
});
