// Endpoint layer for the transaction domain — see features/dashboard/api.ts
// for the pattern this follows: the BFF proxy transport (browserApi), not
// the pre-BFF axiosInstance.
//
// NOTE (found, not fixed — preserving exact current behavior per this
// migration's own rule): getTransactionData's "boosting", "services" and
// "promotions" cases all call the same plan-subscription endpoint as
// "plan-subscriptions" does, even though the backend has dedicated
// /admin/transaction/{boosts,services,promotions} routes (see
// adminTransactionRoutes below — BOOSTS/SERVICES/PROMOTIONS are defined but
// unused here). Looks like unfinished routing logic, not a path-string bug;
// reproduced as-is.
//
// Wallet-withdrawal detail is deliberately NOT duplicated here —
// adminTransactionRoutes.WALLET_WITHDRAWAL is the exact same endpoint the
// already-migrated wallet domain's useWalletDetailQuery already calls; the
// wallet-details consumer page below reuses that hook instead.
import { browserApi } from "@/lib/browser-api";
import { adminTransactionRoutes } from "@lemonade/api-types";

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
  user?: { fullname?: string };
  wallet?: { wallet_id?: string };
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
  // Threaded through every case uniformly, including boosting/services/promotions
  // — their routing to PLAN_SUBSCRIPTION is a pre-existing bug (see the NOTE
  // above), reproduced as-is; not this change's problem to fix.
  getTransactionData: (trxType: TransactionListType, pagination?: { page?: number; perPage?: number }) => {
    const params = pagination?.page
      ? { page: pagination.page, per_page: pagination.perPage }
      : undefined;

    switch (trxType) {
      case "plan-subscriptions":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.PLAN_SUBSCRIPTION, { params });
      case "wallet-withdrawals":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.WALLET_WITHDRAWALS, { params });
      case "boosting":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.PLAN_SUBSCRIPTION, { params });
      case "services":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.PLAN_SUBSCRIPTION, { params });
      case "events":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.EVENTS, { params });
      case "promotions":
        return browserApi.get<TransactionListResponse>(adminTransactionRoutes.PLAN_SUBSCRIPTION, { params });
    }
  },

  getPlanSubscription: (id: number) =>
    browserApi.get<PlanSubscriptionDetailResponse>(
      `${adminTransactionRoutes.PLAN_SUBSCRIPTION}/${id}`,
    ),

  getEventDetail: (id: number) =>
    browserApi.get<TransactionEventDetailResponse>(`${adminTransactionRoutes.EVENT}/${id}`),
};
