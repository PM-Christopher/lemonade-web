import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ApiError } from "@lemonade/api-client";
import WalletSettingsClient from "./WalletSettingsClient";

// This app's Vitest config doesn't run .svg imports through SVGR (only the real Next.js build
// does) — mocked for any component test touching an icon import, same gap as elsewhere.
vi.mock("@/images/icons/chevron-left.svg", () => ({
  default: () => <span data-testid="chevron-left-icon" />,
}));

vi.mock("@/components/layouts/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const authState = { isLoggedIn: true };

vi.mock("react-redux", () => ({
  useSelector: () => authState,
}));

const dispatchMock = vi.fn();

vi.mock("@/redux/hook", () => ({
  useAppDispatch: () => dispatchMock,
}));

vi.mock("@/hooks/useNavigation", () => ({
  useNavigation: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    pushWithQuery: vi.fn(),
    pathname: "/settings/wallet",
    search: "",
    isActive: () => false,
    getQueryParam: () => null,
  }),
}));

vi.mock("@/components/settings/RewardsHistorySideMenu", () => ({
  default: () => null,
}));

vi.mock("@/components/settings/TribeHistorySideMenu", () => ({
  default: ({ isOpen }: { isOpen: boolean }) => (isOpen ? <p>Tribe history panel</p> : null),
}));

vi.mock("@/components/settings/Modal/RequestPayoutModal", () => ({
  default: () => null,
}));

const walletQueryMock = vi.fn();
const savedBank = {
  data: { bank_account: { bank_name: "Zenith Bank", account_name: "Demo", account_number: "0" } },
  isSuccess: true,
};
let bankQueryResult: { data?: unknown; isSuccess: boolean } = savedBank;
const redeemMutateMock = vi.fn();
const payoutMutateMock = vi.fn();

vi.mock("@/features/settings/queries", () => ({
  useWalletSettingsQuery: (...args: unknown[]) => walletQueryMock(...args),
  useBankAccountQuery: () => bankQueryResult,
}));

vi.mock("@/features/settings/mutations", () => ({
  useRequestPayoutMutation: () => ({ mutate: payoutMutateMock, isPending: false }),
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

const walletData = {
  total_amount_earned: "150000.00",
  points_balance: 0,
  rewards_earned: "0.00",
  payout_history: [],
  payout_request: true,
};

describe("WalletSettingsClient — monetized tribes", () => {
  it("shows the tribe earnings and opens the tribe history", () => {
    walletQueryMock.mockReturnValue({
      data: { ...walletData, monetized_tribes: "4500.00" },
      isLoading: false,
    });

    render(<WalletSettingsClient />);

    expect(screen.getByText("Monetized Tribes")).toBeInTheDocument();
    expect(screen.getByText("₦4,500")).toBeInTheDocument();
    expect(screen.queryByText("Tribe history panel")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "View tribe history" }));
    expect(screen.getByText("Tribe history panel")).toBeInTheDocument();
  });
});

describe("WalletSettingsClient — payout request", () => {
  beforeEach(() => {
    payoutMutateMock.mockReset();
    dispatchMock.mockReset();
    walletQueryMock.mockReturnValue({ data: walletData, isLoading: false });
  });

  it("requests a payout of the full available balance, leaving the amount to the server", () => {
    render(<WalletSettingsClient />);

    fireEvent.click(screen.getByRole("button", { name: /request pay ?out/i }));

    expect(payoutMutateMock).toHaveBeenCalledWith({}, expect.any(Object));
  });

  it("shows the server-formatted payout amount in the success toast", () => {
    payoutMutateMock.mockImplementation((_payload, opts) =>
      opts.onSuccess({
        message: "Your payout request has been submitted",
        withdrawal_request_id: "wr-1",
        amount_minor: 15000000,
        amount: "150000.00",
      }),
    );
    render(<WalletSettingsClient />);

    fireEvent.click(screen.getByRole("button", { name: /request pay ?out/i }));

    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          message: expect.stringContaining("Payout of ₦150,000 requested"),
          type: "success",
        }),
      }),
    );
  });

  it("shows the server's reason when a payout is refused", () => {
    payoutMutateMock.mockImplementation((_payload, opts) =>
      opts.onError(
        new ApiError({
          status: 400,
          errorCode: "not-specified",
          message: "Your available balance is below the minimum payout of 100000",
          kind: "server",
        }),
      ),
    );
    render(<WalletSettingsClient />);

    fireEvent.click(screen.getByRole("button", { name: /request pay ?out/i }));

    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          message: "Your available balance is below the minimum payout of 100000",
          type: "error",
        }),
      }),
    );
  });
});

describe("WalletSettingsClient — payout eligibility", () => {
  it("hides the payout button until the server says a payout is available", () => {
    walletQueryMock.mockReturnValue({
      data: { ...walletData, payout_request: false },
      isLoading: false,
    });
    render(<WalletSettingsClient />);

    expect(screen.queryByRole("button", { name: /request pay ?out/i })).not.toBeInTheDocument();
  });

  it("keeps the payout button disabled until the bank account has loaded", () => {
    bankQueryResult = { isSuccess: false };
    walletQueryMock.mockReturnValue({ data: walletData, isLoading: false });
    render(<WalletSettingsClient />);

    expect(screen.getByRole("button", { name: /request pay ?out/i })).toBeDisabled();
    bankQueryResult = savedBank;
  });

  it("asks for a bank account instead of requesting a payout when none is saved", () => {
    bankQueryResult = { data: { bank_account: null }, isSuccess: true };
    payoutMutateMock.mockReset();
    walletQueryMock.mockReturnValue({ data: walletData, isLoading: false });
    render(<WalletSettingsClient />);

    fireEvent.click(screen.getByRole("button", { name: /request pay ?out/i }));

    expect(payoutMutateMock).not.toHaveBeenCalled();
    bankQueryResult = savedBank;
  });
});
