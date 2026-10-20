import { useQuery } from "@tanstack/react-query";
import { businessesApi, type BusinessFilters } from "./api";

export const businessKeys = {
  all: () => ["business"] as const,
  lists: () => [...businessKeys.all(), "list"] as const,
  list: (filters: BusinessFilters) => [...businessKeys.lists(), filters] as const,
  services: (filters: BusinessFilters) => [...businessKeys.all(), "services", filters] as const,
  service: (id: string) => [...businessKeys.all(), "service", id] as const,
  details: () => [...businessKeys.all(), "detail"] as const,
  detail: (id: string) => [...businessKeys.details(), id] as const,
};

// The business review/moderation queue is the "operational queues" bucket
// from CLAUDE.md's staleness table (30s) — matches events/reporting.
export function useBusinessListQuery(filters: BusinessFilters, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: businessKeys.list(filters),
    queryFn: () => businessesApi.getBusinesses(filters),
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

// Escrow totals are money, so they are never served stale.
export function useServiceListQuery(filters: BusinessFilters, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: businessKeys.services(filters),
    queryFn: () => businessesApi.getServices(filters),
    staleTime: 0,
    enabled: options?.enabled,
  });
}

export function useServiceDetailQuery(id: string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: businessKeys.service(id ?? ""),
    queryFn: () => businessesApi.getService(id as string),
    staleTime: 0,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}
