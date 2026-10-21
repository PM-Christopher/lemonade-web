import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { supportApi, type SupportInboxFilters } from "./api";

export const supportKeys = {
  all: () => ["support"] as const,
  inbox: (filters: SupportInboxFilters) => [...supportKeys.all(), "inbox", filters] as const,
  replies: () => [...supportKeys.all(), "replies"] as const,
};

// People are waiting on answers, so the inbox refreshes often.
export function useSupportInboxQuery(
  filters: SupportInboxFilters,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: supportKeys.inbox(filters),
    queryFn: () => supportApi.getInbox(filters),
    staleTime: 0,
    refetchInterval: 20_000,
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}

// Ready-made answers change rarely.
export function useSavedRepliesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: supportKeys.replies(),
    queryFn: supportApi.getReplies,
    staleTime: 5 * 60_000,
    enabled: options?.enabled,
  });
}
