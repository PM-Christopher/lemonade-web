import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import DisputesClient, { waitingLabel } from "./DisputesClient";
import type { DisputeListResponse } from "@/features/disputes/api";

const list = vi.fn();
const mutate = vi.fn();
const push = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push }) }));
vi.mock("@/features/authentication/queries", () => ({
  useCurrentAdminQuery: () => ({ data: { id: "a1" } }),
}));
vi.mock("@/features/disputes/queries", () => ({
  useDisputeListQuery: (...args: unknown[]) => list(...args),
}));
vi.mock("@/features/disputes/mutations", () => ({
  useAssignDisputeMutation: () => ({ mutate, isPending: false }),
}));

const dispute = (id: string, overdue: boolean, assignee: { id: string; name: string } | null) => ({
  id,
  status: "pending" as const,
  dispute: "Not delivered",
  attachments: [],
  date_raised: "2026-10-18T10:00:00Z",
  age_hours: overdue ? 60 : 2,
  overdue,
  assignee,
  assigned_at: null,
  raised_by: null,
  raised_by_role: "client" as const,
  job: {
    id: "j1",
    amount_minor: 100000,
    amount: "1,000.00",
    status: "IN_DISPUTE",
    services: [],
    additional_info: null,
    remark: null,
    escrow_status: "disputed",
    business: { id: "b1", name: `Business ${id}`, image: null },
    client: null,
    owner: null,
  },
});

const data: DisputeListResponse = {
  summary: { open: 2, overdue: 1, unassigned: 1, mine: 1, overdue_after_hours: 48 },
  disputes: [dispute("d1", true, null), dispute("d2", false, { id: "a1", name: "Charles" })],
};

describe("DisputesClient", () => {
  beforeEach(() => {
    list.mockReset();
    mutate.mockReset();
    push.mockReset();
    list.mockReturnValue({ data, isLoading: false });
  });

  it("writes the waiting time in plain words", () => {
    expect(waitingLabel(0)).toBe("Just now");
    expect(waitingLabel(5)).toBe("5h");
    expect(waitingLabel(52)).toBe("2d 4h");
  });

  it("marks the overdue dispute and shows who has the other", () => {
    render(<DisputesClient />);

    expect(screen.getByText(/2d 12h · overdue/)).toBeInTheDocument();
    expect(screen.getByText("Charles")).toBeInTheDocument();
  });

  it("lets you take an unassigned dispute without opening it", () => {
    render(<DisputesClient />);

    fireEvent.click(screen.getByRole("button", { name: "Take it" }));

    expect(mutate.mock.calls[0][0]).toEqual({ id: "d1", adminId: undefined });
    expect(push).not.toHaveBeenCalled();
  });

  it("releases a dispute you hold", () => {
    render(<DisputesClient />);

    fireEvent.click(screen.getByRole("button", { name: "Release" }));

    expect(mutate.mock.calls[0][0]).toEqual({ id: "d2", adminId: null });
  });

  it("filters to overdue disputes from the card", () => {
    render(<DisputesClient />);

    fireEvent.click(screen.getByRole("button", { name: /Overdue/ }));

    expect(list).toHaveBeenLastCalledWith(
      "pending",
      expect.objectContaining({ filters: expect.objectContaining({ overdue: true }) }),
    );
  });
});
