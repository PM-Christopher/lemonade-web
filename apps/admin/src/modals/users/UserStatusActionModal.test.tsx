import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import UserStatusActionModal from "./UserStatusActionModal";

const suspend = vi.fn();
const deactivate = vi.fn();
const dispatch = vi.fn();
const toggle = vi.fn();

vi.mock("react-redux", () => ({ useDispatch: () => dispatch }));
vi.mock("@/features/user/mutations", () => ({
  useSuspendUserMutation: () => ({ mutate: suspend, isPending: false }),
  useDeactivateUserMutation: () => ({ mutate: deactivate, isPending: false }),
}));

describe("UserStatusActionModal", () => {
  beforeEach(() => {
    suspend.mockReset();
    deactivate.mockReset();
    dispatch.mockReset();
    toggle.mockReset();
  });

  it("suspends with the default reason and thanks the admin", () => {
    suspend.mockImplementation((_reason, options) => options.onSuccess());
    render(<UserStatusActionModal isOpen toggle={toggle} id="u1" action="suspend" />);

    expect(screen.getByText(/no longer have access to their account/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Suspend" }));

    expect(suspend).toHaveBeenCalledWith("Policy violation", expect.any(Object));
    expect(toggle).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: expect.objectContaining({ type: "success" }) }),
    );
  });

  it("deactivates with the reason that was picked", () => {
    render(<UserStatusActionModal isOpen toggle={toggle} id="u1" action="deactivate" />);

    fireEvent.change(screen.getByLabelText("Reason"), {
      target: { value: "Inappropriate behavior" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Deactivate" }));

    expect(deactivate).toHaveBeenCalledWith("Inappropriate behavior", expect.any(Object));
    expect(suspend).not.toHaveBeenCalled();
  });

  it("stays open and shows the error when it fails", () => {
    suspend.mockImplementation((_reason, options) => options.onError(new Error("No can do")));
    render(<UserStatusActionModal isOpen toggle={toggle} id="u1" action="suspend" />);

    fireEvent.click(screen.getByRole("button", { name: "Suspend" }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ message: "No can do", type: "error" }),
      }),
    );
    expect(toggle).not.toHaveBeenCalled();
  });
});
