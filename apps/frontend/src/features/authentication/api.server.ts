// Server-side twin of api.ts's client endpoints — for prefetching in a
// Server Component. Same pattern as features/events/api.server.ts: only
// the endpoints actually prefetched, using backendApi (direct-to-backend)
// instead of browserApi (BFF-proxy, client-only).
import "server-only";
import { backendApi } from "@/lib/server-api";
import {
  userProfileRoutes,
  userSubscriptionRoutes,
} from "@lemonade/api-types/generated";
import type {
  AppSettingsResponse,
  SubscriptionResponse,
  BillingHistoryResponse,
} from "./api";

export const authServerApi = {
  getNotificationSettings: () =>
    backendApi.get<AppSettingsResponse>(
      userProfileRoutes.NOTIFICATION_SETTINGS_SHOW,
    ),

  getSubscription: () =>
    backendApi.get<SubscriptionResponse>(userProfileRoutes.SUBSCRIPTION_SHOW),

  getBillingHistory: () =>
    backendApi.get<BillingHistoryResponse>(
      userProfileRoutes.SUBSCRIPTION_BILLING_HISTORY,
    ),

  getSubscriptionPlans: () =>
    backendApi.get<{ subscriptions: unknown[] }>(userSubscriptionRoutes.LIST),
};
