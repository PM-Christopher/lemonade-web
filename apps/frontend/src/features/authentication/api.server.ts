// Server-side twin of api.ts's client endpoints — for prefetching in a
// Server Component. Same pattern as features/events/api.server.ts: only
// the endpoints actually prefetched, using backendApi (direct-to-backend)
// instead of browserApi (BFF-proxy, client-only).
import "server-only";
import { backendApi } from "@/lib/server-api";
import {
  userSettingsRoutes,
  userSubscriptionRoutes,
} from "@lemonade/api-types";
import type {
  AppSettingsResponse,
  SubscriptionResponse,
  BillingHistoryResponse,
} from "./api";

export const authServerApi = {
  getNotificationSettings: () =>
    backendApi.get<AppSettingsResponse>(
      userSettingsRoutes.NOTIFICATION_SETTINGS,
    ),

  getSubscription: () =>
    backendApi.get<SubscriptionResponse>(userSettingsRoutes.SUBSCRIPTION),

  getBillingHistory: () =>
    backendApi.get<BillingHistoryResponse>(
      `${userSettingsRoutes.SUBSCRIPTION}/billing-history`,
    ),

  getSubscriptionPlans: () =>
    backendApi.get<{ subscriptions: unknown[] }>(userSubscriptionRoutes.BASE),
};
