import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminTransactionRoutes } from "@lemonade/api-types";
import type {
  TransactionListResponse,
  PlanSubscriptionDetailResponse,
  TransactionEventDetailResponse,
} from "./api";

export const transactionServerApi = {
  getPlanSubscriptions: () =>
    backendApi.get<TransactionListResponse>(
      adminTransactionRoutes.PLAN_SUBSCRIPTION,
    ),

  getPlanSubscription: (id: number | string) =>
    backendApi.get<PlanSubscriptionDetailResponse>(
      `${adminTransactionRoutes.PLAN_SUBSCRIPTION}/${id}`,
    ),

  getEventDetail: (id: number | string) =>
    backendApi.get<TransactionEventDetailResponse>(
      `${adminTransactionRoutes.EVENT}/${id}`,
    ),
};
