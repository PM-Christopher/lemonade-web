import { useQuery } from "@tanstack/react-query";
import { walletApi } from "./api";

export const walletKeys = {
  all: () => ["wallet"] as const,
  data: () => [...walletKeys.all(), "data"] as const,
  withdrawalRequests: (page?: number) =>
    page
      ? ([...walletKeys.all(), "withdrawalRequests", page] as const)
      : ([...walletKeys.all(), "withdrawalRequests"] as const),
  detail: (id: string | number) => [...walletKeys.all(), "detail", id] as const,
  pointsRates: () => [...walletKeys.all(), "points-rates"] as const,
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
export function useWithdrawalRequestsQuery(options?: {
  enabled?: boolean;
  page?: number;
  perPage?: number;
}) {
  return useQuery({
    queryKey: walletKeys.withdrawalRequests(options?.page),
    queryFn: () =>
      walletApi.getWithdrawalRequests({ page: options?.page, perPage: options?.perPage }),
    staleTime: 30_000,
    enabled: options?.enabled,
  });
}

/** One withdrawal request's detail, including the requester's live balance. */
export function useWalletDetailQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: walletKeys.detail(id ?? 0),
    queryFn: () => walletApi.getWalletDetail(id as string | number),
    staleTime: 0,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

/** Admin-configurable rates — reference data, 1h bucket per CLAUDE.md's staleness table. */
export function usePointsRatesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: walletKeys.pointsRates(),
    queryFn: walletApi.getPointsRates,
    staleTime: 3_600_000,
    enabled: options?.enabled,
  });
}
