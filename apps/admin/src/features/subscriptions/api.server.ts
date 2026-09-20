import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminSubscriptionsRoutes } from "@lemonade/api-types/generated";
import type { SubscriptionPlanListResponse } from "./api";

export const subscriptionsServerApi = {
  getPlans: () => backendApi.get<SubscriptionPlanListResponse>(adminSubscriptionsRoutes.LIST),
};
