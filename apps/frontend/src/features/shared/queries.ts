import { useQuery } from "@tanstack/react-query";
import { sharedApi } from "./api";

export const sharedKeys = {
  all: () => ["shared"] as const,
  banks: () => [...sharedKeys.all(), "banks"] as const,
  businessCategories: () =>
    [...sharedKeys.all(), "businessCategories"] as const,
};

// Reference data (the servicing-bank list) — CLAUDE.md's "reference data"
// staleness bucket (1h).
export function useBanksQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: sharedKeys.banks(),
    queryFn: sharedApi.getBanks,
    staleTime: 60 * 60_000,
    enabled: options?.enabled,
  });
}

// Reference data (the business-listing category catalog) — same bucket as
// useBanksQuery. Consumed by business/add-business and
// business/[id]/edit-business, both previously on the legacy useRequest
// hook (see features/business/api.ts's NOTE).
export function useBusinessCategoriesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: sharedKeys.businessCategories(),
    queryFn: sharedApi.getBusinessCategories,
    staleTime: 60 * 60_000,
    enabled: options?.enabled,
  });
}
