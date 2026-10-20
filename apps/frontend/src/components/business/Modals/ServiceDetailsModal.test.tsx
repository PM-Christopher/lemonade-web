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
  useReviewJobMutation: () => ({ mutateAsync: vi.fn() }),
}));
vi.mock("@/features/business/queries", () => ({
  useBusinessQuery: () => ({ data: undefined }),
}));
const stub = vi.hoisted(() => () => ({ default: () => null }));
vi.mock("@/components/business/Modals/ConfirmPaymentModal", stub);
vi.mock("@/components/business/Modals/PayNowModal", stub);
vi.mock("@/components/business/Modals/ConfirmCompletionModal", stub);
vi.mock("@/components/business/Modals/DisputeJobModal", stub);
vi.mock("@/components/business/Modals/SubmitDisputeModal", stub);
vi.mock("@/components/business/Modals/ReviewModal", stub);
vi.mock("@/components/business/Modals/RequestServiceModal", stub);

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
  refunded: false,
  is_owner: false,
  created_at: "2026-10-01T10:00:00Z",
  ...overrides,
});

const renderJob = (overrides: Partial<ServiceRequestJob>) =>
  render(<ServiceDetailsModal isOpen toggleMenu={vi.fn()} job={job(overrides)} loading={false} />);

const button = (name: RegExp) => screen.getByRole("button", { name });
const noButton = (name: RegExp) =>
  expect(screen.queryByRole("button", { name })).not.toBeInTheDocument();

describe("ServiceDetailsModal", () => {
  it("lets the business owner accept or reject a pending job", () => {
    renderJob({ is_owner: true, status: "PENDING" });

    expect(button(/accept/i)).toBeInTheDocument();
    expect(button(/reject/i)).toBeInTheDocument();
  });

  it("doesn't show the owner's choices to the person who requested the job", () => {
    renderJob({ is_owner: false, status: "PENDING" });

    noButton(/accept/i);
  });

  it("lets the requester pay as soon as the owner accepts", () => {
    renderJob({ is_owner: false, status: "ACCEPTED", payment_requested: false });

    expect(button(/make payment/i)).toBeInTheDocument();
  });

  it("tells the owner to wait for payment after accepting", () => {
    renderJob({ is_owner: true, status: "ACCEPTED" });

    expect(screen.getByText(/you'll get payment notification/i)).toBeInTheDocument();
    noButton(/request payment/i);
  });

  it("lets the owner request payment once the job is in progress", () => {
    renderJob({ is_owner: true, status: "IN_PROGRESS", payment_requested: false });

    expect(button(/request payment/i)).toBeInTheDocument();
  });

  it("shows the owner a waiting notice and a dispute option after requesting payment", () => {
    renderJob({ is_owner: true, status: "IN_PROGRESS", payment_requested: true });

    expect(screen.getByText(/awaiting confirmation/i)).toBeInTheDocument();
    expect(button(/dispute job/i)).toBeInTheDocument();
    noButton(/request payment/i);
  });

  it("tells each side when a disputed payment was refunded", () => {
    const { unmount } = renderJob({ is_owner: true, status: "COMPLETED", refunded: true });
    expect(screen.getByText("Client has been refunded")).toBeInTheDocument();
    unmount();

    renderJob({ is_owner: false, status: "COMPLETED", refunded: true });
    expect(screen.getByText("Your payment was refunded")).toBeInTheDocument();
  });

  it("lets the requester complete or dispute a job in progress", () => {
    renderJob({ is_owner: false, status: "IN_PROGRESS", payment_requested: true });

    expect(screen.getByText(/business owner is requesting payment/i)).toBeInTheDocument();
    expect(button(/mark as completed/i)).toBeInTheDocument();
    expect(button(/^dispute$/i)).toBeInTheDocument();
  });

  it("lets the requester rate a completed job", () => {
    renderJob({ is_owner: false, status: "COMPLETED" });

    expect(button(/rate business/i)).toBeInTheDocument();
  });

  it("lets the requester send another quote after a rejection", () => {
    renderJob({ is_owner: false, status: "REJECTED", remark: "Too low" });

    expect(screen.getByText("Too low")).toBeInTheDocument();
    expect(button(/send another quote/i)).toBeInTheDocument();
  });

  it("shows the business, the notes and the amount in naira", () => {
    renderJob({ status: "IN_PROGRESS" });

    expect(screen.getByText("Sparkle Cleaners")).toBeInTheDocument();
    expect(screen.getByText(/Lagos/)).toBeInTheDocument();
    expect(screen.getByText("Bring your own mop")).toBeInTheDocument();
    expect(screen.getByText("₦200")).toBeInTheDocument();
  });
});
