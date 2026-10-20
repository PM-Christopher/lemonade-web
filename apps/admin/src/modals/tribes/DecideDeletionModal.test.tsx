import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import DecideDeletionModal from "./DecideDeletionModal";
import type { TribeDeletionRequestItem } from "@/features/tribes/api";

const mutate = vi.fn();

vi.mock("react-redux", () => ({ useDispatch: () => vi.fn() }));
vi.mock("@/features/tribes/mutations", () => ({
  useDecideTribeDeletionMutation: () => ({ mutate, isPending: false }),
}));

const request: TribeDeletionRequestItem = {
  id: "r1",
  status: "pending",
  reason: "Winding down",
  decision_reason: null,
  requested_at: "2026-10-20T10:00:00Z",
  decided_at: null,
  tribe: {
    id: "t1",
    name: "Design Circle",
    members: 12,
    access_fee: "5000.00",
    total_earned: "60000.00",
  },
  owner: { id: "u1", name: "Ada" },
};

describe("DecideDeletionModal", () => {
  beforeEach(() => mutate.mockReset());

  it("shows what the tribe earned before approving a deletion", () => {
    render(<DecideDeletionModal request={request} decision="approve" toggle={vi.fn()} />);

    expect(screen.getByText(/₦60,000/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(mutate).toHaveBeenCalledWith(
      { id: "r1", decision: "approve", reason: undefined },
      expect.any(Object),
    );
  });

  it("sends the reason when rejecting", () => {
    render(<DecideDeletionModal request={request} decision="reject" toggle={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Reason"), {
      target: { value: "Members paid recently" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Keep tribe" }));

    expect(mutate).toHaveBeenCalledWith(
      { id: "r1", decision: "reject", reason: "Members paid recently" },
      expect.any(Object),
    );
  });
});
