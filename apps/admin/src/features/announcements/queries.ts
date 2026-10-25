import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { announcementsApi } from "./api";

export const announcementKeys = {
  all: () => ["announcements"] as const,
  lists: () => [...announcementKeys.all(), "list"] as const,
  list: (search = "") => [...announcementKeys.lists(), search] as const,
  detail: (id: string | number) => [...announcementKeys.all(), "detail", id] as const,
};

export function useAnnouncementsQuery(options?: { enabled?: boolean; search?: string }) {
  return useQuery({
    queryKey: announcementKeys.list(options?.search),
    queryFn: () => announcementsApi.getAnnouncements(options?.search),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

export function useAnnouncementDetailQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: announcementKeys.detail(id ?? 0),
    queryFn: () => announcementsApi.getAnnouncement(id as string | number),
    staleTime: 60_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}
