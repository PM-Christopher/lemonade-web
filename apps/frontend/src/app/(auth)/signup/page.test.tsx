import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SignupPage from "./page";

const signupMock = vi.fn();

vi.mock("@/features/authentication/authApi", () => ({
  signup: (...args: unknown[]) => signupMock(...args),
}));

vi.mock("@/components/layouts/AuthLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/redux/hook", () => ({
  useAppDispatch: () => vi.fn(),
}));

vi.mock("react-cookie", () => ({
  useCookies: () => [{}, vi.fn()],
}));

let searchParamsValue = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => searchParamsValue,
}));

describe("SignupPage referral capture", () => {
  beforeEach(() => {
    signupMock.mockReset();
    searchParamsValue = new URLSearchParams();
  });

  it("prefills the referral code field from a ?referral= link", () => {
    searchParamsValue = new URLSearchParams({ referral: "FRIEND123" });

    render(<SignupPage />);

    const referralInput = screen.getByLabelText(/referral code/i) as HTMLInputElement;
    expect(referralInput.value).toBe("FRIEND123");
  });

  it("leaves the referral code empty and editable when no link param is present", () => {
    render(<SignupPage />);

    const referralInput = screen.getByLabelText(/referral code/i) as HTMLInputElement;
    expect(referralInput.value).toBe("");

    fireEvent.change(referralInput, { target: { value: "TYPED456" } });
    expect(referralInput.value).toBe("TYPED456");
  });

  it("includes the referral code in the submitted signup payload", async () => {
    searchParamsValue = new URLSearchParams({ referral: "FRIEND123" });

    render(<SignupPage />);

    fireEvent.change(screen.getByPlaceholderText(/jane doe/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText(/janedoe@example.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "Password123!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /create account/i }).closest("form")!);

    await vi.waitFor(() => expect(signupMock).toHaveBeenCalled());

    const [submittedValues] = signupMock.mock.calls[0];
    expect(submittedValues.referral_code).toBe("FRIEND123");
  });
});
