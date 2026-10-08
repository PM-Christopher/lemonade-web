import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ApiError } from "@lemonade/api-client";
import { DEFAULT_ERROR_CODE } from "@lemonade/api-types";
import BusinessSection from "./BusinessSection";

const verifyJobPayment = vi.fn();
const dispatch = vi.fn();
const replace = vi.fn();
const invalidateQueries = vi.fn();
let search = "";

vi.mock("@/features/business/api", () => ({
  businessApi: { verifyJobPayment: (...args: unknown[]) => verifyJobPayment(...args) },
}));
vi.mock("@tanstack/react-query", () => ({ useQueryClient: () => ({ invalidateQueries }) }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(search) }));
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ replace }) }));
vi.mock("@/components/global/BusinessCarousel", () => ({ default: () => null }));
vi.mock("@/components/business/AllBusinessCard", () => ({ default: () => null }));
vi.mock("@/components/Skeletons", () => ({
  AllBusinessSkeleton: () => null,
  BusinessCarouselSkeleton: () => null,
}));
vi.mock("@/components/business/Modals/PaymentConfirmModal", () => ({
  default: ({ isOpen, job }: { isOpen: boolean; job: { name?: string; amount?: number } }) =>
    isOpen ? (
      <div role="dialog">
        {job.name} paid {job.amount}
      </div>
    ) : null,
}));

const renderSection = () =>
  render(<BusinessSection businesses={[]} featured={[]} loading={false} />);

describe("BusinessSection job payment confirmation", () => {
  beforeEach(() => {
    verifyJobPayment.mockReset();
    dispatch.mockReset();
    replace.mockReset();
    invalidateQueries.mockReset();
  });

  it("does nothing without a Paystack reference", () => {
    search = "";
    renderSection();
    expect(verifyJobPayment).not.toHaveBeenCalled();
  });

  it("verifies the reference and shows the paid job", async () => {
    search = "trxref=REF-1&reference=REF-1";
    verifyJobPayment.mockResolvedValue({
      verified: true,
      paid_at: "2026-10-08T10:00:00Z",
      job: { id: 7, amount: 50000, services: ["Design"], business: { name: "Ada Studio" } },
    });

    renderSection();

    expect(await screen.findByRole("dialog")).toHaveTextContent("Ada Studio paid 50000");
    expect(verifyJobPayment).toHaveBeenCalledWith("REF-1");
    expect(invalidateQueries).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("?");
  });

  it("shows the server's message when verification fails", async () => {
    search = "trxref=REF-2";
    verifyJobPayment.mockRejectedValue(
      new ApiError({
        status: 404,
        errorCode: DEFAULT_ERROR_CODE,
        message: "Payment not found",
        kind: "notFound",
      }),
    );

    renderSection();

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({ message: "Payment not found", type: "error" }),
        }),
      ),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
