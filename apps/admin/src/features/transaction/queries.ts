import { useQuery } from "@tanstack/react-query";
import {
  transactionApi,
  type AllPaymentsFilters,
  type LedgerFilters,
  type TransactionListFilters,
  type TransactionListType,
} from "./api";

export const transactionKeys = {
  all: () => ["transaction"] as const,
  list: (
    trxType: string,
    page?: number,
    from?: string,
    to?: string,
    status?: string,
    search?: string,
  ) =>
    [
      ...transactionKeys.all(),
      "list",
      trxType,
      page ?? 0,
      from ?? "",
      to ?? "",
      status ?? "",
      search ?? "",
    ] as const,
  boostDetail: (id: string) => [...transactionKeys.all(), "boost-detail", id] as const,
  serviceDetail: (id: string) => [...transactionKeys.all(), "service-detail", id] as const,
  promotionDetail: (id: string) => [...transactionKeys.all(), "promotion-detail", id] as const,
  payments: (filters?: AllPaymentsFilters) =>
    [...transactionKeys.all(), "payments", filters ?? {}] as const,
  ledger: (filters?: LedgerFilters) => [...transactionKeys.all(), "ledger", filters ?? {}] as const,
  subscriptionDetail: (id: string | number) =>
    [...transactionKeys.all(), "subscription-detail", id] as const,
  eventDetail: (id: string | number) => [...transactionKeys.all(), "event-detail", id] as const,
  tribeDetail: (id: string | number) => [...transactionKeys.all(), "tribe-detail", id] as const,
};

/** Financial reporting data, not a live balance — but still money-adjacent, staleTime 0 like wallet. */
export function useTransactionDataQuery(
  trxType: string,
  options?: TransactionListFilters & { enabled?: boolean },
) {
  return useQuery({
    queryKey: transactionKeys.list(
      trxType,
      options?.page,
      options?.from,
      options?.to,
      options?.status,
      options?.search,
    ),
    queryFn: () =>
      transactionApi.getTransactionData(trxType as TransactionListType, {
        page: options?.page,
        perPage: options?.perPage,
        from: options?.from,
        to: options?.to,
        status: options?.status,
        search: options?.search,
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

export function useTransactionTribeDetailQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: transactionKeys.tribeDetail(id ?? 0),
    queryFn: () => transactionApi.getTribeDetail(id as string | number),
    staleTime: 0,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

export function useAllPaymentsQuery(filters?: AllPaymentsFilters) {
  return useQuery({
    queryKey: transactionKeys.payments(filters),
    queryFn: () => transactionApi.getAllPayments(filters),
    staleTime: 0,
  });
}

export function useLedgerQuery(filters?: LedgerFilters) {
  return useQuery({
    queryKey: transactionKeys.ledger(filters),
    queryFn: () => transactionApi.getLedger(filters),
    staleTime: 0,
  });
}

export function useBoostTransactionQuery(id: string | undefined) {
  return useQuery({
    queryKey: transactionKeys.boostDetail(id ?? ""),
    queryFn: () => transactionApi.getBoostDetail(id as string),
    staleTime: 0,
    enabled: Boolean(id),
  });
}

export function useServiceTransactionQuery(id: string | undefined) {
  return useQuery({
    queryKey: transactionKeys.serviceDetail(id ?? ""),
    queryFn: () => transactionApi.getServiceDetail(id as string),
    staleTime: 0,
    enabled: Boolean(id),
  });
}

export function usePromotionTransactionQuery(id: string | undefined) {
  return useQuery({
    queryKey: transactionKeys.promotionDetail(id ?? ""),
    queryFn: () => transactionApi.getPromotionDetail(id as string),
    staleTime: 0,
    enabled: Boolean(id),
  });
}
