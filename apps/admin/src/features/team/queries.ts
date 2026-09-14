import { useQuery } from "@tanstack/react-query";
import { teamApi } from "./api";

export const teamKeys = {
  all: () => ["team"] as const,
  list: () => [...teamKeys.all(), "list"] as const,
  detail: (id: number) => [...teamKeys.all(), "detail", id] as const,
};

export function useTeamQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: teamKeys.list(),
    queryFn: teamApi.getTeamData,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

export function useTeamDetailQuery(id: number | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: teamKeys.detail(id ?? 0),
    queryFn: () => teamApi.getTeamDetail(id as number),
    staleTime: 60_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}
