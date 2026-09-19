// Endpoint layer for the wallet domain — see features/dashboard/api.ts for
// the pattern this follows: the BFF proxy transport (browserApi), not the
// pre-BFF axiosInstance.
import { browserApi } from "@/lib/browser-api";
import { adminWalletRoutes, adminTransactionRoutes, buildPath } from "@lemonade/api-types/generated";

export interface WalletData {
  // Pre-formatted decimal strings from the backend (money is formatted
  // server-side, never computed client-side) — DataCard's `count` prop
  // runs `Number(count)` before display, so these still render correctly.
  wallet_revenue: string;
  wallet_revenue_minor: number;
  total_wallets: number;
  withdrawal_threshold: string;
  withdrawal_threshold_minor: number;
  wallets: unknown[];
}

export interface WithdrawalRequestRow {
  id: number;
  txn_id?: string;
  fullname: string;
  amount: number;
  created_at: string;
  date_paid: string;
  status: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface WithdrawalRequests {
  history: WithdrawalRequestRow[];
  // The backend's wallet-withdrawals response also carries these
  // platform-wide totals; not currently read here (see useWalletDataQuery
  // for that), included for completeness against the real response shape.
  wallet_revenue?: string;
  wallet_revenue_minor?: number;
  total_wallets?: number;
  meta?: PaginationMeta;
}

export interface WalletDetail {
  info: Record<string, unknown> & {
    fullname?: string;
    transaction_id?: string | null;
    date_paid?: string;
    status?: string;
    amount_minor?: number;
    amount?: string;
    account_number?: string;
    account_name?: string;
    bank_name?: string;
  };
  // A second admin domain (transaction/wallet-details, reusing this same
  // endpoint — see its own api.ts) reads more of these fields than the
  // wallet-management detail page does; typed against the real live
  // response rather than only what wallet-management happens to use.
  history: Array<{
    id?: string;
    unique_id?: string;
    user_id?: string;
    wallet_id?: string;
    amount?: number;
    status?: string;
    created_at?: string;
    wallet?: { wallet_id?: string; balance?: number };
  }>;
}

export const walletApi = {
  getWalletData: () => browserApi.get<WalletData>(adminWalletRoutes.DASHBOARD),

  // page omitted -> old unpaginated shape (docs/ARCHITECTURE.md §22 Conflict 1).
  getWithdrawalRequests: (pagination?: { page?: number; perPage?: number }) =>
    browserApi.get<WithdrawalRequests>(adminTransactionRoutes.WALLET_WITHDRAWALS, {
      params: pagination?.page
        ? { page: pagination.page, per_page: pagination.perPage }
        : undefined,
    }),

  getWalletDetail: (id: number) =>
    browserApi.get<WalletDetail>(buildPath(adminTransactionRoutes.WALLET_WITHDRAWAL, { id })),

  updateWithdrawalThreshold: (threshold: number) =>
    browserApi.patch(adminWalletRoutes.UPDATE_WITHDRAWAL_THRESHOLD, { threshold }),

  withdrawalRequestDecision: (id: unknown, type: string) =>
    browserApi.patch(buildPath(adminWalletRoutes.USER_WITHDRAWAL_REQUEST, { id: String(id) }), {
      type,
    }),

  // amount must go out as a JSON number — the backend's Money::fromUnits()
  // rejects a string outright (found live-testing this migration; the
  // pre-migration thunk had the same bug, sending values.amount as-is).
  addToWallet: (id: unknown, amount: number) =>
    browserApi.patch(buildPath(adminWalletRoutes.USER_ADD, { id: String(id) }), { amount }),

  deductFromWallet: (id: unknown, amount: number) =>
    browserApi.patch(buildPath(adminWalletRoutes.USER_DEDUCT, { id: String(id) }), { amount }),
};
