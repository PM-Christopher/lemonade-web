import { useQuery } from "@tanstack/react-query";
import { transactionApi, type TransactionListType } from "./api";

export const transactionKeys = {
  all: () => ["transaction"] as const,
  list: (trxType: string, page?: number) =>
    page
      ? ([...transactionKeys.all(), "list", trxType, page] as const)
      : ([...transactionKeys.all(), "list", trxType] as const),
  subscriptionDetail: (id: string | number) =>
    [...transactionKeys.all(), "subscription-detail", id] as const,
  eventDetail: (id: string | number) => [...transactionKeys.all(), "event-detail", id] as const,
};

/** Financial reporting data, not a live balance — but still money-adjacent, staleTime 0 like wallet. */
export function useTransactionDataQuery(
  trxType: string,
  options?: { enabled?: boolean; page?: number; perPage?: number },
) {
  return useQuery({
    queryKey: transactionKeys.list(trxType, options?.page),
    queryFn: () =>
      transactionApi.getTransactionData(trxType as TransactionListType, {
        page: options?.page,
        perPage: options?.perPage,
      }),
    staleTime: 0,
    enabled: Boolean(trxType) && options?.enabled !== false,
  });
}

export function usePlanSubscriptionDetailQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: transactionKeys.subscriptionDetail(id ?? 0),
    queryFn: () => transactionApi.getPlanSubscription(id as string | number),
    staleTime: 0,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

export function useTransactionEventDetailQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: transactionKeys.eventDetail(id ?? 0),
    queryFn: () => transactionApi.getEventDetail(id as string | number),
    staleTime: 0,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}
