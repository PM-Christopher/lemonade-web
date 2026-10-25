import { useQuery } from "@tanstack/react-query";
import { pagesApi } from "./api";

export const pageKeys = {
  all: () => ["pages"] as const,
  list: () => [...pageKeys.all(), "list"] as const,
};

// Policy text changes rarely, so it is read fresh when the settings page opens.
export function usePolicyPagesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: pageKeys.list(),
    queryFn: pagesApi.getPages,
    staleTime: 0,
    enabled: options?.enabled,
  });
}
