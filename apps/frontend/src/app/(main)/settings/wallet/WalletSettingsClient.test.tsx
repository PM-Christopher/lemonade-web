import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WalletSettingsClient from "./WalletSettingsClient";

// This app's Vitest config doesn't run .svg imports through SVGR (only the real Next.js build
// does) — mocked for any component test touching an icon import, same gap as elsewhere.
vi.mock("@/images/icons/chevron-left.svg", () => ({
  default: () => <span data-testid="chevron-left-icon" />,
}));

vi.mock("@/components/layouts/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("react-redux", () => ({
  useSelector: () => ({ user: { has_bank_account: true }, isLoggedIn: true }),
}));

vi.mock("@/redux/hook", () => ({
  useAppDispatch: () => vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/settings/RewardsHistorySideMenu", () => ({
  default: () => null,
}));

vi.mock("@/components/settings/Modal/RequestPayoutModal", () => ({
  default: () => null,
}));

vi.mock("@/components/settings/Modal/PayoutModal", () => ({
  default: () => null,
}));

const walletQueryMock = vi.fn();
const redeemMutateMock = vi.fn();

vi.mock("@/features/settings/queries", () => ({
  useWalletSettingsQuery: (...args: unknown[]) => walletQueryMock(...args),
}));

vi.mock("@/features/settings/mutations", () => ({
  useRequestPayoutMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useRedeemPointsMutation: () => ({ mutate: redeemMutateMock, isPending: false }),
}));

describe("WalletSettingsClient — Points balance", () => {
  beforeEach(() => {
    redeemMutateMock.mockReset();
  });

  it("shows the real points balance and a redeem button when points are available", () => {
    walletQueryMock.mockReturnValue({
      data: {
        total_amount_earned: "5000.00",
        points_balance: 12,
        rewards_earned: "1200.00",
        payout_history: [],
        payout_request: false,
      },
      isLoading: false,
    });

    render(<WalletSettingsClient />);

    expect(screen.getByText("Points balance")).toBeInTheDocument();
    expect(screen.getByText("12 pts")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /redeem/i })).toBeInTheDocument();
  });

  it("hides the redeem button when there are no points to redeem", () => {
    walletQueryMock.mockReturnValue({
      data: {
        total_amount_earned: "0.00",
        points_balance: 0,
        rewards_earned: "0.00",
        payout_history: [],
        payout_request: false,
      },
      isLoading: false,
    });

    render(<WalletSettingsClient />);

    expect(screen.getByText("0 pts")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /redeem/i })).not.toBeInTheDocument();
  });

  it("redeems with a fresh idempotency key and no explicit points (redeem all)", () => {
    walletQueryMock.mockReturnValue({
      data: {
        total_amount_earned: "5000.00",
        points_balance: 12,
        rewards_earned: "1200.00",
        payout_history: [],
        payout_request: false,
      },
      isLoading: false,
    });

    render(<WalletSettingsClient />);

    fireEvent.click(screen.getByRole("button", { name: /redeem/i }));

    expect(redeemMutateMock).toHaveBeenCalledTimes(1);
    const [payload] = redeemMutateMock.mock.calls[0];
    expect(payload.points).toBeUndefined();
    expect(typeof payload.idempotency_key).toBe("string");
    expect(payload.idempotency_key.length).toBeGreaterThan(0);
  });
});
