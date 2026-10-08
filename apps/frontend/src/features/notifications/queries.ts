import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "./api";

export const notificationKeys = {
  all: () => ["notifications"] as const,
  list: () => [...notificationKeys.all(), "list"] as const,
};

// The user's notification list — user-owned content, 60s bucket.
export function useNotificationsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: notificationsApi.list,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}
