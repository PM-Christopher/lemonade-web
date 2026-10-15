import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ApiError } from "@lemonade/api-client";
import UpdatePasswordModal from "./UpdatePasswordModal";

const mutate = vi.fn();
const dispatch = vi.fn();
let isPending = false;

vi.mock("@/images/icons/close.svg", () => ({ default: () => <svg aria-hidden="true" /> }));
vi.mock("@/images/icons/eyeIcon.svg", () => ({ default: () => <svg aria-hidden="true" /> }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("@/features/authentication/mutations", () => ({
  useChangePasswordMutation: () => ({ mutate, isPending }),
}));

const fill = () => {
  fireEvent.change(screen.getByLabelText("Current password"), { target: { value: "Old-Pass-1" } });
  fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "New-Pass-123" } });
  fireEvent.change(screen.getByLabelText("Confirm password"), {
    target: { value: "New-Pass-123" },
  });
};

describe("UpdatePasswordModal", () => {
  beforeEach(() => {
    mutate.mockReset();
    dispatch.mockReset();
    isPending = false;
  });

  it("clears every field and closes after a successful update", async () => {
    mutate.mockImplementation((_values, opts) => opts.onSuccess());
    const toggle = vi.fn();
    render(<UpdatePasswordModal isOpen toggle={toggle} user={null} />);
    fill();

    const save = screen.getAllByRole("button", { name: "Save password" })[0];
    await waitFor(() => expect(save).toBeEnabled());
    fireEvent.click(save);

    await waitFor(() => expect(toggle).toHaveBeenCalledTimes(1));
    expect(screen.getByLabelText("Current password")).toHaveValue("");
    expect(screen.getByLabelText("New Password")).toHaveValue("");
    expect(screen.getByLabelText("Confirm password")).toHaveValue("");
  });

  it("puts a wrong current password on its field and keeps the form open", async () => {
    mutate.mockImplementation((_values, opts) =>
      opts.onError(
        new ApiError({
          status: 422,
          errorCode: "validation-failed",
          kind: "validation",
          message: "Wrong password",
          fieldErrors: { password: ["Wrong password"] },
        }),
      ),
    );
    const toggle = vi.fn();
    render(<UpdatePasswordModal isOpen toggle={toggle} user={null} />);
    fill();

    const save = screen.getAllByRole("button", { name: "Save password" })[0];
    await waitFor(() => expect(save).toBeEnabled());
    fireEvent.click(save);

    expect(await screen.findByText("Wrong password")).toBeInTheDocument();
    expect(toggle).not.toHaveBeenCalled();
  });
});
