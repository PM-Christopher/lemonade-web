import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SettleServiceModal from "./SettleServiceModal";
import type { ServiceDetailResponse } from "@/features/businesses/api";

const mutate = vi.fn();

vi.mock("react-redux", () => ({ useDispatch: () => vi.fn() }));
vi.mock("@/features/businesses/mutations", () => ({
  useSettleServiceMutation: () => ({ mutate, isPending: false }),
}));

const service = {
  escrow: { status: "held", amount: "120000.00" },
  owner_bank: { account_name: "Funmilayo Johnson", bank_name: "GTB", account_number: "0176865312" },
} as unknown as ServiceDetailResponse["service"];

describe("SettleServiceModal", () => {
  beforeEach(() => mutate.mockReset());

  it("shows the owner's bank details before releasing funds", () => {
    render(
      <SettleServiceModal
        isOpen
        toggle={vi.fn()}
        serviceId="s1"
        resolution="release"
        service={service}
      />,
    );

    expect(screen.getByText("₦120,000")).toBeInTheDocument();
    expect(screen.getByText("Funmilayo Johnson")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(mutate).toHaveBeenCalledWith("release", expect.any(Object));
  });

  it("asks to refund the client without bank details", () => {
    render(
      <SettleServiceModal
        isOpen
        toggle={vi.fn()}
        serviceId="s1"
        resolution="refund"
        service={service}
      />,
    );

    expect(screen.queryByText("Funmilayo Johnson")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(mutate).toHaveBeenCalledWith("refund", expect.any(Object));
  });
});
