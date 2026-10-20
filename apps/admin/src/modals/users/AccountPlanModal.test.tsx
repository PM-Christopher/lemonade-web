import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import AccountPlanModal from "./AccountPlanModal";

const cancel = vi.fn();
const change = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/features/user/queries", () => ({
  useAccountPlanQuery: () => ({
    data: {
      current: {
        title: "Premium",
        type: "yearly",
        status: "active",
        amount_minor: 2300000,
        amount: "23000.00",
        renews_at: "2030-05-05T00:00:00Z",
        auto_renew: true,
        card: { brand: "Mastercard", last4: "7829" },
      },
      subscription_history: [
        {
          id: "1",
          txn_id: "TX12343",
          name: "Lemonade-Premium",
          amount: "23000.00",
          created_at: "2024-04-04T00:00:00Z",
        },
      ],
    },
  }),
}));
vi.mock("@/features/subscriptions/queries", () => ({
  useSubscriptionPlanListQuery: () => ({
    data: {
      plans: [
        { id: "p1", title: "Pay-As-You-Go", active: true },
        { id: "p2", title: "Membership", active: true },
        { id: "p3", title: "Old plan", active: false },
      ],
    },
  }),
}));
vi.mock("@/features/user/mutations", () => ({
  useCancelPlanMutation: () => ({ mutate: cancel, isPending: false }),
  useChangePlanMutation: () => ({ mutate: change, isPending: false }),
}));

describe("AccountPlanModal", () => {
  beforeEach(() => {
    cancel.mockReset();
    change.mockReset();
  });

  it("shows the plan, renewal, card and payments from the server", () => {
    render(<AccountPlanModal isOpen toggle={vi.fn()} id="u1" />);

    expect(screen.getByText("Premium")).toBeInTheDocument();
    expect(screen.getByText("₦23,000/Yr")).toBeInTheDocument();
    expect(screen.getByText(/Renews May 05, 2030/)).toBeInTheDocument();
    expect(screen.getByText("Mastercard ***7829")).toBeInTheDocument();
    expect(screen.getByText("TX12343")).toBeInTheDocument();
  });

  it("asks before cancelling the renewal", () => {
    render(<AccountPlanModal isOpen toggle={vi.fn()} id="u1" />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel renewal" }));
    expect(cancel).not.toHaveBeenCalled();
    expect(screen.getByText(/end of the current billing cycle/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(cancel).toHaveBeenCalled();
  });

  it("changes to the chosen active plan", () => {
    render(<AccountPlanModal isOpen toggle={vi.fn()} id="u1" />);

    fireEvent.click(screen.getByRole("button", { name: "Change plan" }));
    expect(screen.queryByRole("option", { name: "Old plan" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Select plan"), { target: { value: "p2" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(change).toHaveBeenCalledWith({ subscription_id: "p2" }, expect.any(Object));
  });
});
