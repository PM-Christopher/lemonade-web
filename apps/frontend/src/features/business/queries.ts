import { useQuery } from "@tanstack/react-query";
import { businessApi } from "./api";

export const businessKeys = {
  all: () => ["business"] as const,
  businesses: () => [...businessKeys.all(), "businesses"] as const,
  listings: () => [...businessKeys.all(), "listings"] as const,
  detail: (id: number | string) => [...businessKeys.all(), "detail", id] as const,
  jobsData: () => [...businessKeys.all(), "jobsData"] as const,
  businessJobData: (id: number | string) => [...businessKeys.all(), "businessJobData", id] as const,
  boostPackages: () => [...businessKeys.all(), "boostPackages"] as const,
};

// Public browse of other users' businesses — CLAUDE.md's "discovery content"
// bucket (5m).
export function useBusinessesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: businessKeys.businesses(),
    queryFn: businessApi.getBusinesses,
    staleTime: 5 * 60_000,
    enabled: options?.enabled,
  });
}

// The current user's own listings — "user-owned content" bucket (60s).
export function useListingsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: businessKeys.listings(),
    queryFn: businessApi.getListings,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

export function useBusinessQuery(id: number | string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: businessKeys.detail(id ?? 0),
    queryFn: () => businessApi.getBusiness(id as number),
    staleTime: 60_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

// Job payment/lifecycle tracking — money-adjacent, CLAUDE.md's 0 bucket.
export function useJobsDataQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: businessKeys.jobsData(),
    queryFn: businessApi.getJobsData,
    staleTime: 0,
    enabled: options?.enabled,
  });
}

// Job payment/lifecycle tracking for one owned business listing —
// money-adjacent, same 0 bucket as useJobsDataQuery.
export function useBusinessJobDataQuery(
  id: number | string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: businessKeys.businessJobData(id ?? 0),
    queryFn: () => businessApi.getBusinessJobData(id as number),
    staleTime: 0,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

// The boost-listing package catalog — CLAUDE.md's "reference data" bucket
// (1h), same as features/shared's useBanksQuery.
export function useBoostPackagesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: businessKeys.boostPackages(),
    queryFn: businessApi.getBoostPackages,
    staleTime: 60 * 60_000,
    enabled: options?.enabled,
  });
}
