import { useQuery } from "@tanstack/react-query";
import { tribesApi } from "./api";

export const tribeKeys = {
    all: () => ["tribes"] as const,
    lists: () => [...tribeKeys.all(), "list"] as const,
    list: (tribeType: string) => [...tribeKeys.lists(), tribeType] as const,
    detail: (id: string) => [...tribeKeys.all(), "detail", id] as const,
    threads: (id: string) => [...tribeKeys.all(), "threads", id] as const,
    pinnedThreads: (id: string) => [...tribeKeys.all(), "pinnedThreads", id] as const,
    categories: () => [...tribeKeys.all(), "categories"] as const,
};

// "mine" is the user's own tribes (user-owned content, 60s); "discover"/"tln"
// are public browse lists (discovery content, 5m) — CLAUDE.md's staleness
// table.
export function useTribesQuery(tribeType: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: tribeKeys.list(tribeType),
        queryFn: () => tribesApi.getTribes(tribeType),
        staleTime: tribeType === "mine" ? 60_000 : 5 * 60_000,
        enabled: options?.enabled,
    });
}

export function useTribeQuery(id: string | undefined, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: tribeKeys.detail(id ?? ""),
        queryFn: () => tribesApi.getTribe(id as string),
        staleTime: 60_000,
        enabled: Boolean(id) && options?.enabled !== false,
    });
}

export function useThreadsQuery(id: string | undefined, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: tribeKeys.threads(id ?? ""),
        queryFn: () => tribesApi.getThreads(id as string),
        staleTime: 60_000,
        enabled: Boolean(id) && options?.enabled !== false,
    });
}

export function usePinnedThreadsQuery(id: string | undefined, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: tribeKeys.pinnedThreads(id ?? ""),
        queryFn: () => tribesApi.getPinThreads(id as string),
        staleTime: 60_000,
        enabled: Boolean(id) && options?.enabled !== false,
    });
}

// Reference data — CLAUDE.md's 1h bucket.
export function useTribeCategoriesQuery() {
    return useQuery({
        queryKey: tribeKeys.categories(),
        queryFn: tribesApi.getTribeCategories,
        staleTime: 60 * 60_000,
    });
}
