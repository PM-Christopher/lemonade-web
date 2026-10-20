import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ResolveDisputeModal from "./ResolveDisputeModal";

const mutate = vi.fn();
const dispatch = vi.fn();
const toggle = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => dispatch,
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/features/disputes/mutations", () => ({
  useResolveDisputeMutation: () => ({ mutate, isPending: false }),
}));

const renderModal = (resolution: "refund" | "release") =>
  render(<ResolveDisputeModal isOpen toggle={toggle} id="dispute-1" resolution={resolution} />);

describe("ResolveDisputeModal", () => {
  beforeEach(() => {
    mutate.mockReset();
    dispatch.mockReset();
    toggle.mockReset();
  });

  it("refunds the client once the admin confirms", () => {
    mutate.mockImplementation((_payload, options) => options.onSuccess());
    renderModal("refund");

    expect(screen.getByText(/goes back to the client/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Refund" }));

    expect(mutate).toHaveBeenCalledWith({ resolution: "refund" }, expect.any(Object));
    expect(toggle).toHaveBeenCalled();
  });

  it("pays the business owner when the admin chooses to release", () => {
    mutate.mockImplementation((_payload, options) => options.onSuccess());
    renderModal("release");

    fireEvent.click(screen.getByRole("button", { name: "Pay owner" }));

    expect(mutate).toHaveBeenCalledWith({ resolution: "release" }, expect.any(Object));
  });

  it("stays open and shows the error when settling fails", () => {
    mutate.mockImplementation((_payload, options) =>
      options.onError(new Error("Already resolved")),
    );
    renderModal("refund");

    fireEvent.click(screen.getByRole("button", { name: "Refund" }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ message: "Already resolved", type: "error" }),
      }),
    );
    expect(toggle).not.toHaveBeenCalled();
  });
});
