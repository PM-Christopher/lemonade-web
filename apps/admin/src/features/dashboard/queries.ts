import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./api";

export const dashboardKeys = {
  all: () => ["dashboard"] as const,
  metrics: () => [...dashboardKeys.all(), "metrics"] as const,
};

/**
 * Platform-wide stats card — an "operational queue"-class read per
 * docs/ARCHITECTURE.md's staleness table (30s), not money or availability
 * data itself (those figures are formatted server totals, not live
 * balances this page lets anyone act on).
 */
export function useDashboardMetricsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: dashboardKeys.metrics(),
    queryFn: dashboardApi.getMetrics,
    staleTime: 30_000,
    enabled: options?.enabled,
  });
}
