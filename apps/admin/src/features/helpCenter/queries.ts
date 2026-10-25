import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { helpCenterApi } from "./api";

export const helpCenterKeys = {
  all: () => ["help-center"] as const,
  list: (search = "") => [...helpCenterKeys.all(), "list", search] as const,
};

// Operational content edited by staff: 30 seconds.
export function useFaqListQuery(options?: { enabled?: boolean; search?: string }) {
  return useQuery({
    queryKey: helpCenterKeys.list(options?.search),
    queryFn: () => helpCenterApi.list(options?.search),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}
