import { useQuery } from "@tanstack/react-query";
import { businessesApi } from "./api";

export const businessKeys = {
  all: () => ["business"] as const,
  lists: () => [...businessKeys.all(), "list"] as const,
  list: (status: string) => [...businessKeys.lists(), status] as const,
  details: () => [...businessKeys.all(), "detail"] as const,
  detail: (id: string) => [...businessKeys.details(), id] as const,
};

// The business review/moderation queue is the "operational queues" bucket
// from CLAUDE.md's staleness table (30s) — matches events/reporting.
// `status` "pending" (the default query-key label) maps to an omitted
// `?status=` param, which the backend itself defaults to PENDING.
export function useBusinessListQuery(status: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: businessKeys.list(status),
    queryFn: () => businessesApi.getBusinesses(status === "pending" ? undefined : status),
    staleTime: 30_000,
    enabled: options?.enabled,
  });
}

export function useBusinessDetailQuery(id: string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: businessKeys.detail(id ?? ""),
    queryFn: () => businessesApi.getBusinessDetail(id as string),
    staleTime: 30_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}
