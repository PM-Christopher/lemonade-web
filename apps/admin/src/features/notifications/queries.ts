import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "./api";

export const notificationKeys = {
  all: () => ["admin-notifications"] as const,
};

// Admins act on these, so the bell checks every 30 seconds.
export function useAdminNotificationsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: notificationKeys.all(),
    queryFn: notificationsApi.getNotifications,
    staleTime: 0,
    refetchInterval: 30_000,
    enabled: options?.enabled,
  });
}
