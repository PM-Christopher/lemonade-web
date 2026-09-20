import { useQuery } from "@tanstack/react-query";
import { subscriptionsApi } from "./api";

export const subscriptionKeys = {
  all: () => ["subscriptions"] as const,
  lists: () => [...subscriptionKeys.all(), "list"] as const,
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
