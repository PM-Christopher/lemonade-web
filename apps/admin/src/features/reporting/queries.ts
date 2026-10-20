import { useQuery } from "@tanstack/react-query";
import { reportingApi, type ReportFilters } from "./api";

export const reportingKeys = {
  all: () => ["reporting"] as const,
  list: (page?: number, filters: ReportFilters = {}) =>
    page
      ? ([...reportingKeys.all(), "list", page, filters] as const)
      : ([...reportingKeys.all(), "list"] as const),
  detail: (id: string | number) => [...reportingKeys.all(), "detail", id] as const,
};

/** Moderation reports — "operational queue" per the staleness table (30s), named there explicitly. */
export function useReportsQuery(options?: {
  enabled?: boolean;
  page?: number;
  perPage?: number;
  filters?: ReportFilters;
}) {
  return useQuery({
    queryKey: reportingKeys.list(options?.page, options?.filters),
    queryFn: () =>
      reportingApi.getReportData(
        { page: options?.page, perPage: options?.perPage },
        options?.filters,
      ),
    staleTime: 30_000,
    enabled: options?.enabled,
  });
}

export function useReportDetailQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: reportingKeys.detail(id ?? 0),
    queryFn: () => reportingApi.getReportDetail(id as string | number),
    staleTime: 30_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}
