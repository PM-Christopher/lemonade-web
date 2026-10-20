import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminTransactionRoutes, buildPath } from "@lemonade/api-types/generated";
import type {
  TransactionListResponse,
  PlanSubscriptionDetailResponse,
  TransactionEventDetailResponse,
  TransactionTribeDetailResponse,
} from "./api";

export const transactionServerApi = {
  getPlanSubscriptions: (pagination?: { page?: number; perPage?: number }) =>
    backendApi.get<TransactionListResponse>(adminTransactionRoutes.SUBSCRIPTIONS, {
      params: pagination?.page
        ? { page: pagination.page, per_page: pagination.perPage }
        : undefined,
    }),

  getPlanSubscription: (id: number | string) =>
    backendApi.get<PlanSubscriptionDetailResponse>(
      buildPath(adminTransactionRoutes.SUBSCRIPTION, { id }),
    ),

  getTribeDetail: (id: number | string) =>
    backendApi.get<TransactionTribeDetailResponse>(buildPath(adminTransactionRoutes.TRIBE, { id })),

  getEventDetail: (id: number | string) =>
    backendApi.get<TransactionEventDetailResponse>(buildPath(adminTransactionRoutes.EVENT, { id })),
};
