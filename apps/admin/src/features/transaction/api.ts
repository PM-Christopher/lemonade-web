// Endpoints for the transaction domain over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminTransactionRoutes, buildPath } from "@lemonade/api-types/generated";

export interface TransactionHistoryRow {
  id?: number;
  unique_id?: string;
  txn_id?: string;
  user_id?: string;
  amount?: number | string;
  fullname?: string;
  plan?: string;
  status?: string;
  created_at?: string;
  date_paid?: string;
  wallet_id?: string;
  subscription_type?: string;
  user?: { id?: string; fullname?: string; name?: string; username?: string; email?: string };
  wallet?: { wallet_id?: string };
  // PaymentTransactionResource fields — boosting/services/promotions history
  // rows (see app/Http/Resources/Billing/PaymentTransactionResource.php).
  reference?: string;
  type?: string;
  provider?: string;
  channel?: string;
  currency?: string;
  amount_minor?: number;
  paid_at?: string | null;
  paymentable_type?: string;
  paymentable_id?: number;
  // "events" trxType rows — same field names as TransactionEventDetailResponse.info.
  event_name?: string;
  event_image?: string;
  organizer?: string;
  tickets_sold?: number;
  // "tribe-payments" rows.
  tribe_name?: string | null;
  [key: string]: unknown;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface TransactionListResponse {
  history?: TransactionHistoryRow[];
  subscribers?: number;
  revenue?: string;
  revenue_minor?: number;
  total_revenue?: string;
  total_revenue_minor?: number;
  tickets_sold?: number;
  total_events?: number;
  total_transactions?: number;
  successful_transactions?: number;
  total_wallets?: number;
  // "tribe-payments" only: server-formatted naira, plus the paid-tribe count.
  tribe_earnings?: string;
  tribe_commissions?: string;
  total_paid_tribes?: number;
  // Wallet-withdrawals trxType only — same field/shape as the wallet
  // domain's own WalletData.wallet_revenue (features/wallet/api.ts).
  wallet_revenue?: string;
  churn_rate?: number;
  meta?: PaginationMeta;
  [key: string]: unknown;
}

export interface PlanSubscriptionDetailResponse {
  info: Record<string, unknown> & {
    fullname?: string;
    txn_id?: string;
    plan?: string;
    amount?: number;
    status?: string;
    user_id?: string;
  };
  plan: { cost: string; renews: string };
  history: TransactionHistoryRow[];
}

export interface TransactionEventDetailResponse {
  info: Record<string, unknown> & {
    event_name?: string;
    organizer?: string;
    transaction_id?: string;
    tickets_sold?: number;
    created_at?: string;
    status?: string;
    user_id?: string;
  };
  history: TransactionHistoryRow[];
}

export interface TransactionTribeDetailResponse {
  info: TransactionHistoryRow;
  history: TransactionHistoryRow[];
}

export type TransactionListType =
  | "plan-subscriptions"
  | "wallet-withdrawals"
  | "boosting"
  | "tribe-payments"
  | "services"
  | "events"
  | "promotions";

export type PaymentStatus = "pending" | "success" | "failed" | "abandoned";
export type PaymentType =
  "ticket" | "subscription" | "tribe" | "promotion" | "boost" | "service_request";

export interface PaymentTransaction {
  id: string;
  reference: string;
  type: string;
  status: PaymentStatus;
  provider: string | null;
  currency: string;
  // Formatted by the backend, shown as-is.
  amount: string;
  paid_at: string | null;
  created_at: string;
  user: { id: string; name: string; username: string | null; email: string } | null;
}

export interface PaymentTotalsByStatus {
  count: number;
  amount: string;
}

export interface AllPaymentsFilters {
  type?: PaymentType;
  status?: PaymentStatus;
  search?: string;
  page?: number;
}

export interface AllPaymentsResponse {
  transactions: PaymentTransaction[];
  totals_by_status: Partial<Record<PaymentStatus, PaymentTotalsByStatus>>;
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export type LedgerAccountType =
  | "platform"
  | "user_wallet"
  | "tribe_owner"
  | "event_organizer"
  | "affiliate"
  | "escrow_hold"
  | "gateway"
  | "payout_clearing";

export interface LedgerEntry {
  id: string;
  transaction_id: string;
  account_id: string;
  account_type: LedgerAccountType;
  entry_type: string;
  amount: string;
  currency: string;
  description: string | null;
  reference_type: string;
  created_at: string;
}

export interface LedgerFilters {
  account_type?: LedgerAccountType;
  page?: number;
}

export interface LedgerResponse {
  entries: LedgerEntry[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export const transactionApi = {
  getAllPayments: (filters?: AllPaymentsFilters) =>
    browserApi.get<AllPaymentsResponse>(adminTransactionRoutes.LIST, {
      params: {
        type: filters?.type,
        status: filters?.status,
        search: filters?.search || undefined,
        page: filters?.page,
      },
    }),

  getLedger: (filters?: LedgerFilters) =>
    browserApi.get<LedgerResponse>(adminTransactionRoutes.LEDGER, {
      params: { account_type: filters?.account_type, page: filters?.page },
    }),

  // page omitted -> old unpaginated shape (docs/ARCHITECTURE.md §22 Conflict 1).
  // Threaded through every case uniformly.
  getTransactionData: (
    trxType: TransactionListType,
    pagination?: { page?: number; perPage?: number },
  ) => {
    const params = pagination?.page
      ? { page: pagination.page, per_page: pagination.perPage }
      : undefined;

    switch (trxType) {
      case "plan-subscriptions":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.SUBSCRIPTIONS, {
          params,
        });
      case "wallet-withdrawals":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.WALLET_WITHDRAWALS, {
          params,
        });
      case "boosting":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.BOOSTS, { params });
      case "tribe-payments":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.TRIBES, { params });
      case "services":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.SERVICES, { params });
      case "events":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.EVENTS, { params });
      case "promotions":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.PROMOTIONS, {
          params,
        });
    }
  },

  getPlanSubscription: (id: string | number) =>
    browserApi.get<PlanSubscriptionDetailResponse>(
      buildPath(adminTransactionRoutes.SUBSCRIPTION, { id }),
    ),

  getTribeDetail: (id: string | number) =>
    browserApi.get<TransactionTribeDetailResponse>(buildPath(adminTransactionRoutes.TRIBE, { id })),

  getEventDetail: (id: string | number) =>
    browserApi.get<TransactionEventDetailResponse>(buildPath(adminTransactionRoutes.EVENT, { id })),
};
