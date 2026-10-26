import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import PaymentsReviewClient from "./PaymentsReviewClient";
import type { PaymentsToReviewResponse } from "@/features/payments/api";

const query = vi.fn();
const mutate = vi.fn();
const dispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => dispatch,
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/hooks/useDebounce", () => ({
  default: <T,>(value: T) => ({ debouncedValue: value }),
}));
vi.mock("@/features/payments/queries", () => ({
  usePaymentsToReviewQuery: (...args: unknown[]) => query(...args),
}));
vi.mock("@/features/payments/mutations", () => ({
  useVerifyPaymentMutation: () => ({ mutate, mutateAsync: vi.fn(), isPending: false }),
}));

const payment = (id: string, state: "stuck" | "failed") => ({
  id,
  reference: `LMN_REF_${id}_ABCDEFGH`,
  type: "tribe",
  amount: "5000.00",
  status: state === "stuck" ? "pending" : "failed",
  state,
  reason: null,
  settled_at: null,
  settled_by: null,
  provider: "paystack",
  created_at: "2026-10-20T10:00:00Z",
  age_minutes: 130,
  user: { id: "u1", name: "Ada Okafor", email: "ada@example.com" },
});

const data: PaymentsToReviewResponse = {
  stuck_count: 2,
  failed_count: 1,
  settled_count: 3,
  successful_count: 7,
  amount_at_risk: "10000.00",
  types: ["tribe"],
  payments: [payment("p1", "stuck"), payment("p2", "failed")],
  meta: { current_page: 1, last_page: 1, per_page: 25, total: 2 },
};

describe("PaymentsReviewClient", () => {
  beforeEach(() => {
    query.mockReset();
    mutate.mockReset();
    query.mockReturnValue({ data, isLoading: false, isFetching: false });
  });

  it("shows the totals and how long each payment has been waiting", () => {
    render(<PaymentsReviewClient />);

    expect(screen.getByText("Stuck payments")).toBeInTheDocument();
    expect(screen.getByText("₦10,000")).toBeInTheDocument();
    expect(screen.getAllByText("2h 10m ago").length).toBe(2);
  });

  it("checks one payment with Paystack", () => {
    render(<PaymentsReviewClient />);

    fireEvent.click(screen.getAllByRole("button", { name: /^Actions for/ })[0]);
    fireEvent.click(screen.getByRole("menuitem", { name: "Check with Paystack" }));

    expect(mutate.mock.calls[0][0]).toBe("p1");
  });

  it("has a Settled tab that asks for settled payments and shows who settled them", () => {
    render(<PaymentsReviewClient />);

    fireEvent.click(screen.getByRole("button", { name: "Settled" }));

    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ status: "settled", page: 1 }),
      expect.anything(),
    );
  });

  it("has a Successful tab that asks for successful payments and offers no Paystack check on them", () => {
    query.mockReturnValue({
      data: {
        ...data,
        payments: [{ ...payment("p3", "failed"), status: "success", state: "successful" }],
      },
      isLoading: false,
      isFetching: false,
    });
    render(<PaymentsReviewClient />);

    fireEvent.click(screen.getByRole("button", { name: "Successful" }));
    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ status: "successful", page: 1 }),
      expect.anything(),
    );

    fireEvent.click(screen.getAllByRole("button", { name: /^Actions for/ })[0]);
    expect(screen.queryByRole("menuitem", { name: "Check with Paystack" })).toBeNull();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("names the admin who settled a payment", () => {
    query.mockReturnValue({
      data: {
        ...data,
        payments: [
          {
            ...payment("p3", "stuck"),
            state: "settled",
            status: "success",
            settled_at: "2026-10-21T09:00:00Z",
            settled_by: { id: "a1", name: "Rita Reviewer" },
          },
        ],
      },
      isLoading: false,
      isFetching: false,
    });
    render(<PaymentsReviewClient />);

    expect(screen.getByText(/by Rita Reviewer/)).toBeInTheDocument();
  });

  it("filters to stuck payments from the card", () => {
    render(<PaymentsReviewClient />);

    fireEvent.click(screen.getByRole("button", { name: /Stuck payments/ }));

    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ status: "stuck", page: 1 }),
      expect.anything(),
    );
  });

  it("tells you when every payment has finished", () => {
    query.mockReturnValue({
      data: { ...data, payments: [], stuck_count: 0, failed_count: 0 },
      isLoading: false,
      isFetching: false,
    });
    render(<PaymentsReviewClient />);

    expect(screen.getByText(/Nothing to review/)).toBeInTheDocument();
  });
});
