import { useQuery } from "@tanstack/react-query";
import { announcementsApi } from "./api";

export const announcementKeys = {
  all: () => ["announcements"] as const,
  list: () => [...announcementKeys.all(), "list"] as const,
  detail: (id: number) => [...announcementKeys.all(), "detail", id] as const,
};

export function useAnnouncementsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: announcementKeys.list(),
    queryFn: announcementsApi.getAnnouncements,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

export function useAnnouncementDetailQuery(
  id: number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: announcementKeys.detail(id ?? 0),
    queryFn: () => announcementsApi.getAnnouncement(id as number),
    staleTime: 60_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}
