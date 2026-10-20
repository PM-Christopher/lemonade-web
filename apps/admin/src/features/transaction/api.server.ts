import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminTransactionRoutes, buildPath } from "@lemonade/api-types/generated";
import type {
  TransactionListResponse,
  PlanSubscriptionDetailResponse,
  TransactionEventDetailResponse,
  TransactionTribeDetailResponse,
  BoostTransactionDetailResponse,
  ServiceTransactionDetailResponse,
  PromotionTransactionDetailResponse,
} from "./api";

export const transactionServerApi = {
  getBoostDetail: (id: string) =>
    backendApi.get<BoostTransactionDetailResponse>(buildPath(adminTransactionRoutes.BOOST, { id })),

  getServiceDetail: (id: string) =>
    backendApi.get<ServiceTransactionDetailResponse>(
      buildPath(adminTransactionRoutes.SERVICE, { id }),
    ),

  getPromotionDetail: (id: string) =>
    backendApi.get<PromotionTransactionDetailResponse>(
      buildPath(adminTransactionRoutes.PROMOTION, { id }),
    ),

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
