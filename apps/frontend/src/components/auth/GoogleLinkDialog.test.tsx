import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@lemonade/api-client";
import { GoogleLinkDialog } from "./GoogleLinkDialog";

const renderDialog = (onSubmit = vi.fn().mockResolvedValue(undefined), onCancel = vi.fn()) => {
  render(<GoogleLinkDialog open onSubmit={onSubmit} onCancel={onCancel} />);
  return { onSubmit, onCancel };
};

describe("GoogleLinkDialog", () => {
  it("keeps the button off until a password is typed, then submits it", async () => {
    const { onSubmit } = renderDialog();
    const button = screen.getByRole("button", { name: "Link and sign in" });
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret" },
    });
    fireEvent.click(button);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith("secret"));
  });

  it("shows the server's message when the password is wrong", async () => {
    const onSubmit = vi.fn().mockRejectedValue(
      new ApiError({
        status: 401,
        errorCode: "credentials-not-valid",
        message: "Invalid credentials",
        kind: "auth",
      }),
    );
    renderDialog(onSubmit);

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "nope" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Link and sign in" }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  it("cancels", () => {
    const { onCancel } = renderDialog();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });
});
