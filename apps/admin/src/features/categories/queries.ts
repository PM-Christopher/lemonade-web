import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { categoriesApi, type CategoryType } from "./api";

export const categoryKeys = {
  all: () => ["categories"] as const,
  list: (type: CategoryType, search = "") => [...categoryKeys.all(), "list", type, search] as const,
};

// Operational content edited by staff: 30 seconds.
export function useCategoryListQuery(
  type: CategoryType,
  options?: { enabled?: boolean; search?: string },
) {
  return useQuery({
    queryKey: categoryKeys.list(type, options?.search),
    queryFn: () => categoriesApi.list(type, options?.search),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}
