import { useQuery } from "@tanstack/react-query";
import { tribesApi } from "./api";

export const tribeKeys = {
  all: () => ["tribe"] as const,
  lists: () => [...tribeKeys.all(), "list"] as const,
  details: () => [...tribeKeys.all(), "detail"] as const,
  detail: (id: string) => [...tribeKeys.details(), id] as const,
  categories: () => [...tribeKeys.all(), "categories"] as const,
};

// Moderation/oversight data — the "operational queues" bucket from
// CLAUDE.md's staleness table, matching events/reporting.
export function useTribeListQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: tribeKeys.lists(),
    queryFn: tribesApi.getTribeList,
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
