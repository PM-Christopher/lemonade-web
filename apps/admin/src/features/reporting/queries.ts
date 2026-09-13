import { useQuery } from "@tanstack/react-query";
import { reportingApi } from "./api";

export const reportingKeys = {
    all: () => ["reporting"] as const,
    list: () => [...reportingKeys.all(), "list"] as const,
    detail: (id: number) => [...reportingKeys.all(), "detail", id] as const,
};

/** Moderation reports — "operational queue" per the staleness table (30s), named there explicitly. */
export function useReportsQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: reportingKeys.list(),
        queryFn: reportingApi.getReportData,
        staleTime: 30_000,
        enabled: options?.enabled,
    });
}

export function useReportDetailQuery(id: number | undefined, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: reportingKeys.detail(id ?? 0),
        queryFn: () => reportingApi.getReportDetail(id as number),
        staleTime: 30_000,
        enabled: Boolean(id) && options?.enabled !== false,
    });
}
