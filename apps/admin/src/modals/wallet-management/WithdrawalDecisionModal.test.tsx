import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { ApiError } from "@lemonade/api-client";
import WithdrawalDecisionModal from "./WithdrawalDecisionModal";

const decideMutate = vi.fn();
const dispatch = vi.fn();
const useDecision = vi.fn(() => ({ mutate: decideMutate, isPending: false }));

vi.mock("react-redux", () => ({ useDispatch: () => dispatch }));
vi.mock("@/features/wallet/mutations", () => ({
  useWithdrawalRequestDecisionMutation: (_id: string | number) => useDecision(),
}));

const withdrawal = {
  fullname: "Ada Lovelace",
  amount: "150000.00",
  account_name: "ADA LOVELACE",
  bank_name: "Test Bank",
  account_number: "0123456789",
};
const withdrawalId = "01a11b35-c43d-7046-b790-14262d72231a";

const renderModal = (decision: "approve" | "reject") =>
  render(
    <WithdrawalDecisionModal
      isOpen
      toggle={vi.fn()}
      decision={decision}
      withdrawalId={withdrawalId}
      withdrawal={withdrawal}
    />,
  );

const toast = (message: string, type: string) =>
  expect.objectContaining({ payload: expect.objectContaining({ message, type }) });

describe("WithdrawalDecisionModal", () => {
  beforeEach(() => {
    decideMutate.mockReset();
    dispatch.mockReset();
    useDecision.mockClear();
  });

  it("shows the real request details and decides on its full id", () => {
    renderModal("approve");

    expect(screen.getByText("₦150,000")).toBeInTheDocument();
    expect(screen.getByText("ADA LOVELACE")).toBeInTheDocument();
    expect(screen.getByText("0123456789")).toBeInTheDocument();
    expect(useDecision).toHaveBeenCalledWith(withdrawalId);

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(decideMutate).toHaveBeenCalledWith("approve", expect.any(Object));
  });

  it("warns when an approved payout fails at the gateway", () => {
    decideMutate.mockImplementation((_type, opts) =>
      opts.onSuccess({
        status: "Approved",
        payout_status: "failed",
        failure_reason: "Insufficient balance",
      }),
    );
    renderModal("approve");

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));

    expect(dispatch).toHaveBeenCalledWith(
      toast("Approved, but the payout failed: Insufficient balance", "error"),
    );
  });

  it("rejects and shows the server's reason on failure", () => {
    decideMutate.mockImplementation((_type, opts) =>
      opts.onError(
        new ApiError({
          status: 400,
          errorCode: "not-specified",
          message: "Withdrawal request has already been rejected.",
          kind: "server",
        }),
      ),
    );
    renderModal("reject");

    fireEvent.click(screen.getByRole("button", { name: "Reject" }));

    expect(decideMutate).toHaveBeenCalledWith("reject", expect.any(Object));
    expect(dispatch).toHaveBeenCalledWith(
      toast("Withdrawal request has already been rejected.", "error"),
    );
  });

  it("has no accessibility violations", async () => {
    renderModal("approve");
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
