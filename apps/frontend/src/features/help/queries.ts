import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { helpApi, type LegalCategory } from "./api";

export const helpKeys = {
  all: () => ["help"] as const,
  page: (category: string) => [...helpKeys.all(), "page", category] as const,
  faqs: (search = "") => [...helpKeys.all(), "faqs", search] as const,
};

// Policy text changes rarely: reference data, 1h.
export function useLegalPageQuery(category: LegalCategory, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: helpKeys.page(category),
    queryFn: () => helpApi.getPage(category),
    staleTime: 60 * 60_000,
    enabled: options?.enabled,
  });
}

// Help articles: reference data, 1h. Searches are the same data filtered, so they cache too.
export function useFaqsQuery(search?: string) {
  return useQuery({
    queryKey: helpKeys.faqs(search),
    queryFn: () => helpApi.getFaqs(search),
    staleTime: 60 * 60_000,
    placeholderData: keepPreviousData,
  });
}
