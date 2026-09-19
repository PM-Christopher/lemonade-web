// Endpoint layer for the transaction domain — see features/dashboard/api.ts
// for the pattern this follows: the BFF proxy transport (browserApi), not
// the pre-BFF axiosInstance.
//
// boosting/services/promotions used to all route to PLAN_SUBSCRIPTION (found
// during the pagination migration, fixed here) — the backend has always had
// dedicated /admin/transaction/{boosts,services,promotions} routes, they were
// just never wired up on this side.
//
// Wallet-withdrawal detail is deliberately NOT duplicated here —
// adminTransactionRoutes.WALLET_WITHDRAWAL is the exact same endpoint the
// already-migrated wallet domain's useWalletDetailQuery already calls; the
// wallet-details consumer page below reuses that hook instead.
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
  user?: { fullname?: string; name?: string; username?: string; email?: string };
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

export type TransactionListType =
  "plan-subscriptions" | "wallet-withdrawals" | "boosting" | "services" | "events" | "promotions";

export const transactionApi = {
  // page omitted -> old unpaginated shape (docs/ARCHITECTURE.md §22 Conflict 1).
  // Threaded through every case uniformly.
  getTransactionData: (trxType: TransactionListType, pagination?: { page?: number; perPage?: number }) => {
    const params = pagination?.page
      ? { page: pagination.page, per_page: pagination.perPage }
      : undefined;

    switch (trxType) {
      case "plan-subscriptions":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.SUBSCRIPTIONS, { params });
      case "wallet-withdrawals":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.WALLET_WITHDRAWALS, { params });
      case "boosting":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.BOOSTS, { params });
      case "services":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.SERVICES, { params });
      case "events":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.EVENTS, { params });
      case "promotions":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.PROMOTIONS, { params });
    }
  },

  getPlanSubscription: (id: number) =>
    browserApi.get<PlanSubscriptionDetailResponse>(
      buildPath(adminTransactionRoutes.SUBSCRIPTION, { id }),
    ),

  getEventDetail: (id: number) =>
    browserApi.get<TransactionEventDetailResponse>(
      buildPath(adminTransactionRoutes.EVENT, { id }),
    ),
};
