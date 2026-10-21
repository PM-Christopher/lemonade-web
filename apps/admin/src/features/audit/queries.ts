import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { auditApi, type AuditLogFilters } from "./api";

export const auditKeys = {
  all: () => ["audit"] as const,
  list: (filters: AuditLogFilters) => [...auditKeys.all(), "list", filters] as const,
};

// A review queue the team checks while working, so 30 seconds is fresh enough.
export function useAuditLogQuery(filters: AuditLogFilters, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: auditKeys.list(filters),
    queryFn: () => auditApi.getLog(filters),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}
