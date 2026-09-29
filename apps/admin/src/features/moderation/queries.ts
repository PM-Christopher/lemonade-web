import { useQuery } from "@tanstack/react-query";
import { moderationApi, type ModerationContentType, type ModerationContentFilters } from "./api";

export const moderationKeys = {
  all: () => ["moderation"] as const,
  queue: () => [...moderationKeys.all(), "queue"] as const,
  content: (type: ModerationContentType, filters?: ModerationContentFilters) =>
    [...moderationKeys.all(), "content", type, filters ?? {}] as const,
};

/** Operational queue per the staleness table (30s) — same class as reporting's. */
export function useModerationQueueQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: moderationKeys.queue(),
    queryFn: () => moderationApi.getQueue(),
    staleTime: 30_000,
    enabled: options?.enabled,
  });
}

export function useModerationContentQuery(
  type: ModerationContentType,
  filters?: ModerationContentFilters,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: moderationKeys.content(type, filters),
    queryFn: () => moderationApi.getContent(type, filters),
    staleTime: 30_000,
    enabled: options?.enabled,
  });
}
