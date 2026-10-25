import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { teamApi } from "./api";

export const teamKeys = {
  all: () => ["team"] as const,
  lists: () => [...teamKeys.all(), "list"] as const,
  list: (search = "") => [...teamKeys.lists(), search] as const,
  detail: (id: string | number) => [...teamKeys.all(), "detail", id] as const,
  logs: (id: string | number, filters: object) => [...teamKeys.all(), "logs", id, filters] as const,
};

export function useTeamQuery(options?: { enabled?: boolean; search?: string }) {
  return useQuery({
    queryKey: teamKeys.list(options?.search),
    queryFn: () => teamApi.getTeamData(options?.search),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

export function useTeamDetailQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: teamKeys.detail(id ?? 0),
    queryFn: () => teamApi.getTeamDetail(id as string | number),
    staleTime: 60_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

// Operational log, 30s.
export function useTeamActivityLogsQuery(
  id: string | number | undefined,
  filters: { start_date?: string; end_date?: string; page?: number; per_page?: number },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: teamKeys.logs(id ?? 0, filters),
    queryFn: () => teamApi.getActivityLogs(id as string | number, filters),
    staleTime: 30_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}
