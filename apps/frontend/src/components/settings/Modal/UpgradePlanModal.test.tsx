import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { ApiError } from "@lemonade/api-client";
import UpgradePlanModal from "./UpgradePlanModal";

const changePlanMutate = vi.fn();
const dispatch = vi.fn();

vi.mock("@/images/icons/close.svg", () => ({ default: () => <svg aria-hidden="true" /> }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("@/features/authentication/mutations", () => ({
  useChangePlanMutation: () => ({ mutate: changePlanMutate, isPending: false }),
}));

const pricing = [
  { id: 1, title: "Monthly", amount: "5000", pay_by: "month", type: "monthly" },
  { id: 2, title: "Yearly", amount: "50000", pay_by: "year", type: "yearly" },
];

const renderModal = () =>
  render(
    <UpgradePlanModal isOpen toggle={vi.fn()} sub_id={9} subMode="upgrade" pricing={pricing} />,
  );

describe("UpgradePlanModal", () => {
  beforeEach(() => {
    changePlanMutate.mockReset();
    dispatch.mockReset();
  });

  it("keeps Pay now disabled until a plan is chosen", () => {
    renderModal();
    expect(screen.getByRole("button", { name: "Pay now" })).toBeDisabled();
  });

  it("asks the server to change to the chosen plan, sending no amount", () => {
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: /Yearly/ }));
    expect(screen.getByRole("button", { name: /Yearly/ })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Pay now" }));

    const [payload] = changePlanMutate.mock.calls[0];
    expect(payload).toMatchObject({ subscription_id: 9, type: "yearly", mode: "upgrade" });
    expect(payload.redirect_url).toMatch(/\/settings\/plan$/);
    expect(payload).not.toHaveProperty("amount");
  });

  it("confirms a free switch that needs no payment", () => {
    changePlanMutate.mockImplementation((_data, opts) => opts.onSuccess({}));
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: /Monthly/ }));
    fireEvent.click(screen.getByRole("button", { name: "Pay now" }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ message: "Plan updated successfully", type: "success" }),
      }),
    );
  });

  it("shows the server's reason when the change is refused", () => {
    changePlanMutate.mockImplementation((_data, opts) =>
      opts.onError(
        new ApiError({
          status: 403,
          errorCode: "plan-feature-required",
          message: "You are already on this plan",
          kind: "permission",
        }),
      ),
    );
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: /Monthly/ }));
    fireEvent.click(screen.getByRole("button", { name: "Pay now" }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          message: "You are already on this plan",
          type: "error",
        }),
      }),
    );
  });

  it("has no accessibility violations", async () => {
    renderModal();
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
