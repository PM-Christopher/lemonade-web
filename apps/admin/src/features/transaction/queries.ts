import { useQuery } from "@tanstack/react-query";
import { transactionApi, type TransactionListType } from "./api";

export const transactionKeys = {
    all: () => ["transaction"] as const,
    list: (trxType: string) => [...transactionKeys.all(), "list", trxType] as const,
    subscriptionDetail: (id: number) => [...transactionKeys.all(), "subscription-detail", id] as const,
    eventDetail: (id: number) => [...transactionKeys.all(), "event-detail", id] as const,
};

/** Financial reporting data, not a live balance — but still money-adjacent, staleTime 0 like wallet. */
export function useTransactionDataQuery(trxType: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: transactionKeys.list(trxType),
        queryFn: () => transactionApi.getTransactionData(trxType as TransactionListType),
        staleTime: 0,
        enabled: Boolean(trxType) && options?.enabled !== false,
    });
}

export function usePlanSubscriptionDetailQuery(id: number | undefined, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: transactionKeys.subscriptionDetail(id ?? 0),
        queryFn: () => transactionApi.getPlanSubscription(id as number),
        staleTime: 0,
        enabled: Boolean(id) && options?.enabled !== false,
    });
}

export function useTransactionEventDetailQuery(id: number | undefined, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: transactionKeys.eventDetail(id ?? 0),
        queryFn: () => transactionApi.getEventDetail(id as number),
        staleTime: 0,
        enabled: Boolean(id) && options?.enabled !== false,
    });
}
