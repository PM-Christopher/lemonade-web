import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ServiceRequestJob } from "@/features/business/api";
import ServiceDetailsModal from "./ServiceDetailsModal";

const icon = vi.hoisted(() => () => ({ default: () => null }));
vi.mock("@/images/icons/close.svg", icon);
vi.mock("@/images/icons/clockIconOrange.svg", icon);
vi.mock("@/images/icons/checkGreenIcon.svg", icon);
vi.mock("@/images/icons/checkPurpleIcon.svg", icon);
vi.mock("@/images/icons/closeRedIcon.svg", icon);
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push: vi.fn() }) }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => vi.fn() }));
vi.mock("@/features/business/mutations", () => ({
  useMarkJobRequestMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock("@/components/business/Modals/ConfirmPaymentModal", () => ({ default: () => null }));
vi.mock("@/components/business/Modals/PayNowModal", () => ({ default: () => null }));
vi.mock("@/components/business/Modals/ConfirmCompletionModal", () => ({ default: () => null }));

const job = (overrides: Partial<ServiceRequestJob>): ServiceRequestJob => ({
  id: "9b1c2d3e-0000-4000-8000-000000000001",
  business: {
    id: "b-1",
    name: "Sparkle Cleaners",
    image: null,
    user_id: "owner-1",
    city: "Lagos",
    country: "NG",
    service_rate: 5000,
  },
  user: { id: "u-1", fullname: "Ada Lovelace", username: "ada", profile_image: null },
  owner_id: "owner-1",
  amount: 20000,
  services: ["cleaning"],
  additional_info: "Bring your own mop",
  remark: null,
  status: "PENDING",
  payment_requested: false,
  payment_made: false,
  is_owner: false,
  created_at: "2026-10-01T10:00:00Z",
  ...overrides,
});

const renderJob = (overrides: Partial<ServiceRequestJob>) =>
  render(<ServiceDetailsModal isOpen toggleMenu={vi.fn()} job={job(overrides)} loading={false} />);

describe("ServiceDetailsModal", () => {
  it("lets the business owner accept or reject a pending job", () => {
    renderJob({ is_owner: true, status: "PENDING" });

    expect(screen.getByRole("button", { name: /accept/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reject/i })).toBeInTheDocument();
  });

  it("doesn't show the owner's choices to the person who requested the job", () => {
    renderJob({ is_owner: false, status: "PENDING" });

    expect(screen.queryByRole("button", { name: /accept/i })).not.toBeInTheDocument();
  });

  it("lets the requester pay once the owner asks for payment", () => {
    renderJob({ is_owner: false, status: "ACCEPTED", payment_requested: true });

    expect(screen.getByRole("button", { name: /make payment/i })).toBeInTheDocument();
  });

  it("shows the business and the requester's notes", () => {
    renderJob({ status: "IN_PROGRESS" });

    expect(screen.getByText("Sparkle Cleaners")).toBeInTheDocument();
    expect(screen.getByText(/Lagos/)).toBeInTheDocument();
    expect(screen.getByText("Bring your own mop")).toBeInTheDocument();
  });
});
