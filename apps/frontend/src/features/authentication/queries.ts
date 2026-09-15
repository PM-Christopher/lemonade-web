import { useQuery } from "@tanstack/react-query";
import { authApi } from "./api";

// Hierarchical key factory — see docs/ARCHITECTURE.md §11. Only one key
// exists today (currentUser); this is still a factory, not an inline
// array, so invalidation stays precise as the auth domain grows.
export const authKeys = {
  all: () => ["auth"] as const,
  currentUser: () => [...authKeys.all(), "currentUser"] as const,
  subscriptionPlans: () => [...authKeys.all(), "subscriptionPlans"] as const,
  notificationSettings: () =>
    [...authKeys.all(), "notificationSettings"] as const,
  subscription: () => [...authKeys.all(), "subscription"] as const,
  billingHistory: () => [...authKeys.all(), "billingHistory"] as const,
};

/**
 * The single source of truth for "who is logged in, if anyone." Replaces
 * the dead `verifyUserToken` function that used to sit unused in
 * MainLayout.tsx — this one actually runs. A 401 here means there's no
 * valid session (the httpOnly cookie is absent, or refresh already failed
 * server-side inside the BFF proxy) — that's an expected, not-logged-in
 * state, not a transient failure worth retrying.
 */
export function useCurrentUserQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authApi.getCurrentUser,
    staleTime: 60_000,
    retry: false,
    enabled: options?.enabled,
  });
}

// The public plan catalog (settings/plan/page.tsx) — CLAUDE.md's "reference
// data" staleness bucket (1h), same as features/shared's useBanksQuery.
export function useSubscriptionPlansQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authKeys.subscriptionPlans(),
    queryFn: authApi.getSubscriptionPlans,
    staleTime: 60 * 60_000,
    enabled: options?.enabled,
  });
}

// User-owned content — CLAUDE.md's 60s bucket. Lives here (not
// features/settings) so useUpdateNotificationSettingsMutation, already in
// this domain, can invalidate it without a cross-feature import.
export function useNotificationSettingsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authKeys.notificationSettings(),
    queryFn: authApi.getNotificationSettings,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

// The current user's own subscription + benefits — user-owned content.
// Lives here (not features/settings) so useChangePlanMutation can
// invalidate it without a cross-feature import.
export function useSubscriptionQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authKeys.subscription(),
    queryFn: authApi.getSubscription,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

// Past subscription payments — user-owned content.
export function useBillingHistoryQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authKeys.billingHistory(),
    queryFn: authApi.getBillingHistory,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}
