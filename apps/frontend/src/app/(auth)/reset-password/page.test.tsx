import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { ApiError } from "@lemonade/api-client";
import ResetPasswordPage from "./page";
import { routes } from "@/lib/routes";

const resetMutate = vi.fn();
const dispatch = vi.fn();
const push = vi.fn();

vi.mock("@/features/authentication/mutations", () => ({
  useResetPasswordMutation: () => ({ mutate: resetMutate, isPending: false }),
}));
vi.mock("@/components/layouts/AuthLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push }) }));

const submitPasswords = async () => {
  fireEvent.change(screen.getByLabelText("Confirm password"), {
    target: { name: "confirm_password", value: "NewSecret123!" },
  });
  fireEvent.change(screen.getByLabelText(/^Password/), {
    target: { name: "password", value: "NewSecret123!" },
  });
  const save = screen.getByRole("button", { name: "Save password" });
  await waitFor(() => expect(save).toBeEnabled());
  fireEvent.click(save);
};

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    resetMutate.mockReset();
    dispatch.mockReset();
    push.mockReset();
  });

  it("sends the new password and returns to login", async () => {
    resetMutate.mockImplementation((_data, opts) => opts.onSuccess());
    render(<ResetPasswordPage />);

    await submitPasswords();

    await waitFor(() =>
      expect(resetMutate).toHaveBeenCalledWith(
        { password: "NewSecret123!", confirm_password: "NewSecret123!" },
        expect.any(Object),
      ),
    );
    expect(push).toHaveBeenCalledWith(routes.LOGIN);
  });

  it("shows a server validation message under the password field", async () => {
    resetMutate.mockImplementation((_data, opts) =>
      opts.onError(
        new ApiError({
          status: 422,
          errorCode: "same-old-password",
          message: "Invalid",
          kind: "validation",
          fieldErrors: { password: ["You cannot reuse your old password"] },
        }),
      ),
    );
    render(<ResetPasswordPage />);

    await submitPasswords();

    expect(await screen.findByText("You cannot reuse your old password")).toBeInTheDocument();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ResetPasswordPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
