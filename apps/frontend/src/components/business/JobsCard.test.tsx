import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ServiceRequestJob } from "@/features/business/api";
import JobsCard from "./JobsCard";

const getJob = vi.fn();
vi.mock("@/features/business/mutations", () => ({
  useGetJobMutation: () => ({ mutate: getJob, isPending: false }),
}));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => vi.fn() }));
vi.mock("react-redux", () => ({ useSelector: () => ({ selectedJob: null }) }));
vi.mock("next/dynamic", () => ({ default: () => () => null }));
vi.mock("@/images/icons/chevronRight.svg", () => ({ default: () => null }));

const job = (is_owner: boolean): ServiceRequestJob => ({
  id: "job-uuid-1",
  business: {
    id: "b-1",
    name: "Sparkle Cleaners",
    image: null,
    user_id: "owner-1",
    city: "Lagos",
    country: "NG",
    service_rate: null,
  },
  user: null,
  owner_id: "owner-1",
  amount: 20000,
  services: ["cleaning", "laundry"],
  additional_info: null,
  remark: null,
  status: "PENDING",
  payment_requested: false,
  payment_made: false,
  refunded: false,
  is_owner,
  created_at: "2026-10-01T10:00:00Z",
});

describe("JobsCard", () => {
  beforeEach(() => getJob.mockReset());

  it("shows the business on each job", () => {
    render(<JobsCard type="listing" jobs={[job(true)]} />);

    expect(screen.getByText("Sparkle Cleaners")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it.each([
    [true, "listing"],
    [false, "business"],
  ])("opens the job from the right side (is_owner=%s)", (isOwner, type) => {
    render(<JobsCard type="listing" jobs={[job(isOwner)]} />);

    fireEvent.click(screen.getByText("Sparkle Cleaners"));

    expect(getJob).toHaveBeenCalledWith({ id: "job-uuid-1", type }, expect.any(Object));
  });
});
