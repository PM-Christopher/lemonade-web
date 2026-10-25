import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { tribesApi } from "./api";

export const tribeKeys = {
  all: () => ["tribe"] as const,
  lists: () => [...tribeKeys.all(), "list"] as const,
  details: () => [...tribeKeys.all(), "detail"] as const,
  detail: (id: string) => [...tribeKeys.details(), id] as const,
  categories: () => [...tribeKeys.all(), "categories"] as const,
  deletions: (status: string) => [...tribeKeys.all(), "deletions", status] as const,
};

// Moderation/oversight data — the "operational queues" bucket from
// CLAUDE.md's staleness table, matching events/reporting.
export function useTribeListQuery(options?: { enabled?: boolean; search?: string }) {
  return useQuery({
    queryKey: [...tribeKeys.lists(), options?.search ?? ""],
    queryFn: () => tribesApi.getTribeList(options?.search),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled: options?.enabled,
  });
}

export function useTribeDetailQuery(id: string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: tribeKeys.detail(id ?? ""),
    queryFn: () => tribesApi.getTribeDetail(id as string),
    staleTime: 30_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

// Reference data — CLAUDE.md's 1h bucket.
export function useTribeCategoriesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: tribeKeys.categories(),
    queryFn: tribesApi.getTribeCategories,
    staleTime: 60 * 60_000,
    enabled: options?.enabled,
  });
}

// Paid-tribe deletions are money-related, so they are never served stale.
export function useTribeDeletionRequestsQuery(status: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: tribeKeys.deletions(status),
    queryFn: () => tribesApi.getDeletionRequests(status),
    staleTime: 0,
    enabled: options?.enabled,
  });
}
