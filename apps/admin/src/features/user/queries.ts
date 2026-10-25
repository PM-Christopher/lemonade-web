import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { userApi, type AccountInfoParams } from "./api";

export const userKeys = {
  all: () => ["user"] as const,
  lists: () => [...userKeys.all(), "list"] as const,
  list: (trxType: string, page?: number) =>
    page
      ? ([...userKeys.lists(), trxType, page] as const)
      : ([...userKeys.lists(), trxType] as const),
  details: () => [...userKeys.all(), "detail"] as const,
  detail: (id: string | number) => [...userKeys.details(), id] as const,
  affiliateDetail: (id: string | number) => [...userKeys.all(), "affiliate-detail", id] as const,
  accountInfo: (id: string | number, infoType: string) =>
    [...userKeys.all(), "account-info", id, infoType] as const,
  tribeHistory: (id: string | number) => [...userKeys.all(), "tribe-history", id] as const,
};

export function useUserListQuery(
  trxType: string,
  options?: {
    enabled?: boolean;
    page?: number;
    perPage?: number;
    dates?: { start_date?: string; end_date?: string };
    search?: string;
  },
) {
  return useQuery({
    queryKey: [
      ...userKeys.list(trxType, options?.page),
      options?.dates ?? {},
      options?.search ?? "",
    ],
    placeholderData: keepPreviousData,
    queryFn: () =>
      userApi.getUserData(
        trxType,
        { page: options?.page, perPage: options?.perPage },
        options?.dates,
        options?.search,
      ),
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

export function useUserDetailQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: userKeys.detail(id ?? 0),
    queryFn: () => userApi.getUserDetail(id as string | number),
    staleTime: 60_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

export function useAffiliateDetailQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: userKeys.affiliateDetail(id ?? 0),
    queryFn: () => userApi.getAffiliateDetail(id as string | number),
    staleTime: 60_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

export function useAccountInfoQuery(
  id: string | number | undefined,
  infoType: string,
  options?: { enabled?: boolean; params?: AccountInfoParams },
) {
  return useQuery({
    queryKey: [...userKeys.accountInfo(id ?? 0, infoType), options?.params ?? {}],
    queryFn: () => userApi.getAccountInfo(id as string | number, infoType, options?.params),
    staleTime: 60_000,
    enabled: Boolean(id) && Boolean(infoType) && options?.enabled !== false,
  });
}

// Money-adjacent history, so always fresh.
export function useUserTribeHistoryQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: userKeys.tribeHistory(id ?? 0),
    queryFn: () => userApi.getTribeHistory(id as string | number),
    staleTime: 0,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

const detailQuery = <T>(
  key: readonly unknown[],
  fn: () => Promise<T>,
  id: string | number | undefined,
  options?: { enabled?: boolean },
  staleTime = 60_000,
) => ({
  queryKey: key,
  queryFn: fn,
  staleTime,
  enabled: Boolean(id) && options?.enabled !== false,
});

export function useUserBusinessQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery(
    detailQuery(
      [...userKeys.all(), "business", id],
      () => userApi.getBusiness(id as string | number),
      id,
      options,
    ),
  );
}

export function useUserTribeQuery(
  id: string | number | undefined,
  tribeId: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery(
    detailQuery(
      [...userKeys.all(), "tribe", id, tribeId],
      () => userApi.getUserTribe(id as string | number, tribeId as string | number),
      tribeId === undefined ? undefined : id,
      options,
    ),
  );
}

// Plan and payout data is money-adjacent, so always fresh.
export function useAccountPlanQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery(
    detailQuery(
      [...userKeys.all(), "account-plan", id],
      () => userApi.getAccountPlan(id as string | number),
      id,
      options,
      0,
    ),
  );
}

export function usePayoutHistoryQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery(
    detailQuery(
      [...userKeys.all(), "payout-history", id],
      () => userApi.getPayoutHistory(id as string | number),
      id,
      options,
      0,
    ),
  );
}

export function useReferralHistoryQuery(
  affiliateId: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery(
    detailQuery(
      [...userKeys.all(), "referral-history", affiliateId],
      () => userApi.getReferralHistory(affiliateId as string | number),
      affiliateId,
      options,
      0,
    ),
  );
}

export function useAffiliateHistoryQuery(
  affiliateId: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery(
    detailQuery(
      [...userKeys.all(), "affiliate-history", affiliateId],
      () => userApi.getAffiliateHistory(affiliateId as string | number),
      affiliateId,
      options,
      0,
    ),
  );
}

/** The support thread is polled while the chat is open, so new replies show up. */
export function useSupportMessagesQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...detailQuery(
      [...userKeys.all(), "support-chat", id],
      () => userApi.getSupportMessages(id as string | number),
      id,
      options,
      0,
    ),
    refetchInterval: 10_000,
  });
}
