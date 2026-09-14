import { useQuery } from "@tanstack/react-query";
import { businessApi } from "./api";

export const businessKeys = {
    all: () => ["business"] as const,
    businesses: () => [...businessKeys.all(), "businesses"] as const,
    listings: () => [...businessKeys.all(), "listings"] as const,
    detail: (id: number | string) => [...businessKeys.all(), "detail", id] as const,
    jobsData: () => [...businessKeys.all(), "jobsData"] as const,
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
