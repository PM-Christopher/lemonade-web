import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { ApiError } from "@lemonade/api-client";
import VerifyCodeClient from "./VerifyCodeClient";

const forgotMutate = vi.fn();
const verifyMutateAsync = vi.fn();
const dispatch = vi.fn();
const setCookie = vi.fn();

vi.mock("@/features/authentication/mutations", () => ({
  useForgotPasswordMutation: () => ({ mutate: forgotMutate }),
  useVerifyPasswordResetOtpMutation: () => ({ mutateAsync: verifyMutateAsync, isPending: false }),
}));
vi.mock("@/components/layouts/AuthLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("react-cookie", () => ({
  useCookies: () => [{ email: "ada@example.com", newToken: "old-token" }, setCookie],
}));
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push: vi.fn() }) }));

const toast = (message: string, type: string) =>
  expect.objectContaining({ payload: expect.objectContaining({ message, type }) });

describe("VerifyCodeClient (forgot password)", () => {
  beforeEach(() => {
    for (const fn of [forgotMutate, verifyMutateAsync, dispatch, setCookie]) fn.mockReset();
    // An old countdown start makes "Send code again" available straight away.
    localStorage.setItem("otp_timer_start", String(Date.now() - 10 * 60 * 1000));
  });

  it("resends by requesting a new reset code for the saved email, without any login", async () => {
    forgotMutate.mockImplementation((_payload, opts) =>
      opts.onSuccess({ token: "new-token", email: "ada@example.com" }),
    );
    render(<VerifyCodeClient />);

    fireEvent.click(await screen.findByRole("button", { name: "Send code again" }));

    expect(forgotMutate).toHaveBeenCalledWith({ email: "ada@example.com" }, expect.any(Object));
    expect(setCookie).toHaveBeenCalledWith("newToken", "new-token", expect.any(Object));
    expect(dispatch).toHaveBeenCalledWith(
      toast("A new code has been sent to ada@example.com. Please try again", "success"),
    );
  });

  it("shows the server's expired-code message", async () => {
    verifyMutateAsync.mockRejectedValue(
      new ApiError({
        status: 400,
        errorCode: "not-specified",
        message: "The code has expired or is invalid.",
        kind: "server",
      }),
    );
    render(<VerifyCodeClient />);

    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input, i) => fireEvent.change(input, { target: { value: String(i + 1) } }));

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith(toast("The code has expired or is invalid.", "error")),
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<VerifyCodeClient />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
