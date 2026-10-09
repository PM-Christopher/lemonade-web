import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { ApiError } from "@lemonade/api-client";
import ForgotPasswordPage from "./ForgotPasswordClient";
import { routes } from "@/lib/routes";

const forgotMutate = vi.fn();
const dispatch = vi.fn();
const push = vi.fn();
const setCookie = vi.fn();

vi.mock("@/features/authentication/mutations", () => ({
  useForgotPasswordMutation: () => ({ mutate: forgotMutate, isPending: false }),
}));
vi.mock("@/components/layouts/AuthLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("react-cookie", () => ({ useCookies: () => [{}, setCookie] }));
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push }) }));

const submitEmail = async () => {
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { name: "email", value: "ada@example.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: /send|continue|reset/i }));
  await waitFor(() => expect(forgotMutate).toHaveBeenCalled());
};

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    for (const fn of [forgotMutate, dispatch, push, setCookie]) fn.mockReset();
  });

  it("stores the reset token and moves on to code entry", async () => {
    forgotMutate.mockImplementation((_data, opts) =>
      opts.onSuccess({ token: "reset-token", email: "ada@example.com" }),
    );
    render(<ForgotPasswordPage />);

    await submitEmail();

    expect(forgotMutate.mock.calls[0][0]).toEqual({ email: "ada@example.com" });
    expect(setCookie).toHaveBeenCalledWith("newToken", "reset-token", expect.any(Object));
    expect(push).toHaveBeenCalledWith(routes.VERIFY_CODE);
  });

  it("shows an unknown-account error under the email field", async () => {
    forgotMutate.mockImplementation((_data, opts) =>
      opts.onError(
        new ApiError({
          status: 422,
          errorCode: "no-account",
          message: "Invalid",
          kind: "validation",
          fieldErrors: { email: ["We could not find that account"] },
        }),
      ),
    );
    render(<ForgotPasswordPage />);

    await submitEmail();

    expect(await screen.findByText("We could not find that account")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ForgotPasswordPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
