import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./api";

export const dashboardKeys = {
    all: () => ["dashboard"] as const,
    tribes: () => [...dashboardKeys.all(), "tribes"] as const,
    events: () => [...dashboardKeys.all(), "events"] as const,
    businesses: () => [...dashboardKeys.all(), "businesses"] as const,
};

// Trending/featured discovery content — CLAUDE.md's "discovery content"
// staleness bucket (5m), not the tighter user-owned-content one.
export function useDashboardTribesQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: dashboardKeys.tribes(),
        queryFn: dashboardApi.getTribes,
        staleTime: 5 * 60_000,
        enabled: options?.enabled,
    });
}

export function useDashboardEventsQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: dashboardKeys.events(),
        queryFn: dashboardApi.getEvents,
        staleTime: 5 * 60_000,
        enabled: options?.enabled,
    });
}

export function useDashboardBusinessesQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: dashboardKeys.businesses(),
        queryFn: dashboardApi.getBusinesses,
        staleTime: 5 * 60_000,
        enabled: options?.enabled,
    });
}
