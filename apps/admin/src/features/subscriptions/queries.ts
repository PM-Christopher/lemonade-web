import { useQuery } from "@tanstack/react-query";
import { subscriptionsApi, type PlanSubscribersFilters } from "./api";

export const subscriptionKeys = {
  all: () => ["subscriptions"] as const,
  lists: () => [...subscriptionKeys.all(), "list"] as const,
  overview: () => [...subscriptionKeys.all(), "overview"] as const,
  subscribers: (id: string, filters?: PlanSubscribersFilters) =>
    [...subscriptionKeys.all(), "subscribers", id, filters ?? {}] as const,
};

// The plan catalog is admin-managed content, not a live operational queue —
// same reasoning as usePromotionListQuery in features/events/queries.ts:
// treated like the "user-owned content" bucket (60s) rather than the 30s
// operational one.
export function useSubscriptionPlanListQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: subscriptionKeys.lists(),
    queryFn: subscriptionsApi.getPlans,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

// Counts and revenue per plan are an operational view, so the 30s bucket.
export function useSubscriptionOverviewQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: subscriptionKeys.overview(),
    queryFn: subscriptionsApi.getOverview,
    staleTime: 30_000,
    enabled: options?.enabled,
  });
}

export function usePlanSubscribersQuery(id: string | undefined, filters?: PlanSubscribersFilters) {
  return useQuery({
    queryKey: subscriptionKeys.subscribers(id ?? "", filters),
    queryFn: () => subscriptionsApi.getSubscribers(id as string, filters),
    staleTime: 30_000,
    enabled: Boolean(id),
  });
}
