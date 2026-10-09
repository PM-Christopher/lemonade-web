import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { ApiError } from "@lemonade/api-client";
import LoginPage from "./LoginClient";
import { routes } from "@/lib/routes";

const loginMutateAsync = vi.fn();
const googleMutateAsync = vi.fn();
const dispatch = vi.fn();
const push = vi.fn();
const setCookie = vi.fn();

vi.mock("@/features/authentication/mutations", () => ({
  useLoginMutation: () => ({ mutateAsync: loginMutateAsync }),
  useGoogleAuthMutation: () => ({ mutateAsync: googleMutateAsync }),
}));
vi.mock("@/components/layouts/AuthLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/components/auth/GoogleAuthButton", () => ({
  GoogleAuthButton: ({ onSuccess }: { onSuccess: (r: { access_token: string }) => void }) => (
    <button type="button" onClick={() => onSuccess({ access_token: "google-access" })}>
      Continue with Google
    </button>
  ),
}));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("react-cookie", () => ({ useCookies: () => [{}, setCookie] }));
vi.mock("@/lib/env.client", () => ({ localLoginDefaults: () => ({ email: "", password: "" }) }));
vi.mock("@/hooks/useNavigation", () => ({
  useNavigation: () => ({
    push,
    getQueryParam: (key: string) => (key === "next" ? "/settings/wallet" : null),
  }),
}));

const signIn = async () => {
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { name: "email", value: "ada@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { name: "password", value: "Secret123!" },
  });
  const submit = screen.getByRole("button", { name: "Login" });
  await waitFor(() => expect(submit).toBeEnabled());
  fireEvent.click(submit);
};

describe("LoginPage", () => {
  beforeEach(() => {
    vi.useRealTimers();
    for (const fn of [loginMutateAsync, googleMutateAsync, dispatch, push, setCookie])
      fn.mockReset();
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "test-client";
  });

  it("sends a finished account to the page it came from, without storing any token", async () => {
    loginMutateAsync.mockResolvedValue({ user: { id: 1, username: "ada" } });
    render(<LoginPage />);

    await signIn();

    await waitFor(() =>
      expect(loginMutateAsync).toHaveBeenCalledWith({
        email: "ada@example.com",
        password: "Secret123!",
      }),
    );
    await waitFor(() => expect(push).toHaveBeenCalledWith("/settings/wallet"), { timeout: 2000 });
    expect(setCookie).not.toHaveBeenCalled();
  });

  it("resumes onboarding with the short-lived onboarding token", async () => {
    loginMutateAsync.mockResolvedValue({
      user: { id: 1, username: null, email_verified: true },
      token: "onboarding-token",
      needsOnboarding: true,
    });
    render(<LoginPage />);

    await signIn();

    await waitFor(() => expect(push).toHaveBeenCalledWith(routes.PROFILE_SETUP));
    expect(setCookie).toHaveBeenCalledWith("newToken", "onboarding-token", expect.any(Object));
  });

  it("shows the server's message for wrong credentials", async () => {
    loginMutateAsync.mockRejectedValue(
      new ApiError({
        status: 401,
        errorCode: "credentials-not-valid",
        message: "Invalid credentials",
        kind: "auth",
      }),
    );
    render(<LoginPage />);

    await signIn();

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({ message: "Invalid credentials", type: "error" }),
        }),
      ),
    );
    expect(push).not.toHaveBeenCalled();
  });

  it("signs in with Google through the same flow", async () => {
    googleMutateAsync.mockResolvedValue({ user: { id: 1, username: "ada" } });
    render(<LoginPage />);

    fireEvent.click(screen.getByRole("button", { name: "Continue with Google" }));

    expect(googleMutateAsync).toHaveBeenCalledWith("google-access");
    await waitFor(() => expect(push).toHaveBeenCalledWith("/settings/wallet"), { timeout: 2000 });
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<LoginPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
