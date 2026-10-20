import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UpdatePasswordModal from "./UpdatePasswordModal";

const dispatch = vi.fn();
vi.mock("react-redux", () => ({ useDispatch: () => dispatch }));

const submit = vi.fn();
const toggle = vi.fn();

const renderModal = () => render(<UpdatePasswordModal isOpen toggle={toggle} submit={submit} />);

const fill = (current: string, next: string, confirm: string) => {
  fireEvent.change(screen.getByLabelText("Current password"), { target: { value: current } });
  fireEvent.change(screen.getByLabelText("New password"), { target: { value: next } });
  fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: confirm } });
};

describe("UpdatePasswordModal", () => {
  it("says whose password the current-password field wants when asked", () => {
    render(
      <UpdatePasswordModal
        isOpen
        toggle={toggle}
        submit={submit}
        currentPasswordHint="Enter your own password to confirm the change."
      />,
    );

    expect(screen.getByText("Enter your own password to confirm the change.")).toBeInTheDocument();
  });

  beforeEach(() => {
    submit.mockReset();
    toggle.mockReset();
    dispatch.mockReset();
  });

  it("does not send until the new password is confirmed", async () => {
    renderModal();
    fill("OldPass1!", "NewPass1!x", "Different1!");

    fireEvent.click(screen.getByRole("button", { name: "Save password" }));

    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
  });

  it("sends the three passwords, thanks the admin and closes", async () => {
    submit.mockResolvedValue({});
    renderModal();
    fill("OldPass1!", "NewPass1!x", "NewPass1!x");

    fireEvent.click(screen.getByRole("button", { name: "Save password" }));

    await waitFor(() =>
      expect(submit).toHaveBeenCalledWith({
        password: "OldPass1!",
        new_password: "NewPass1!x",
        new_password_confirmation: "NewPass1!x",
      }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ type: "success" }),
      }),
    );
    expect(toggle).toHaveBeenCalled();
  });

  it("stays open and shows the error when the change is refused", async () => {
    submit.mockRejectedValue(new Error("Current password is wrong"));
    renderModal();
    fill("OldPass1!", "NewPass1!x", "NewPass1!x");

    fireEvent.click(screen.getByRole("button", { name: "Save password" }));

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({ message: "Current password is wrong", type: "error" }),
        }),
      ),
    );
    expect(toggle).not.toHaveBeenCalled();
  });
});
