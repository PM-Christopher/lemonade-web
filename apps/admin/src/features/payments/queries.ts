import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { paymentsApi, type PaymentsToReviewFilters } from "./api";

export const paymentReviewKeys = {
  all: () => ["payments-review"] as const,
  list: (filters: PaymentsToReviewFilters) => [...paymentReviewKeys.all(), filters] as const,
};

// Payment state is money, so it is never served stale.
export function usePaymentsToReviewQuery(
  filters: PaymentsToReviewFilters,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: paymentReviewKeys.list(filters),
    queryFn: () => paymentsApi.getPayments(filters),
    staleTime: 0,
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}
