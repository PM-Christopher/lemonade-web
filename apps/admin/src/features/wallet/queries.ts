import { useQuery } from "@tanstack/react-query";
import { walletApi } from "./api";

export const walletKeys = {
  all: () => ["wallet"] as const,
  data: () => [...walletKeys.all(), "data"] as const,
  withdrawalRequests: () => [...walletKeys.all(), "withdrawalRequests"] as const,
  detail: (id: number) => [...walletKeys.all(), "detail", id] as const,
};

/** Wallet revenue/threshold summary — money data, never stale. */
export function useWalletDataQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: walletKeys.data(),
    queryFn: walletApi.getWalletData,
    staleTime: 0,
    enabled: options?.enabled,
  });
}

/** The withdrawal-request queue — "operational queue" per the staleness table. */
export function useWithdrawalRequestsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: walletKeys.withdrawalRequests(),
    queryFn: walletApi.getWithdrawalRequests,
    staleTime: 30_000,
    enabled: options?.enabled,
  });
}

/** One withdrawal request's detail, including the requester's live balance. */
export function useWalletDetailQuery(id: number | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: walletKeys.detail(id ?? 0),
    queryFn: () => walletApi.getWalletDetail(id as number),
    staleTime: 0,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}
