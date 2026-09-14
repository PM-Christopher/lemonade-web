import { useQuery } from "@tanstack/react-query";
import { userApi } from "./api";

export const userKeys = {
    all: () => ["user"] as const,
    lists: () => [...userKeys.all(), "list"] as const,
    list: (trxType: string) => [...userKeys.lists(), trxType] as const,
    details: () => [...userKeys.all(), "detail"] as const,
    detail: (id: number) => [...userKeys.details(), id] as const,
    affiliateDetail: (id: number) => [...userKeys.all(), "affiliate-detail", id] as const,
    accountInfo: (id: number, infoType: string) => [...userKeys.all(), "account-info", id, infoType] as const,
};

export function useUserListQuery(trxType: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: userKeys.list(trxType),
        queryFn: () => userApi.getUserData(trxType),
        staleTime: 60_000,
        enabled: options?.enabled,
    });
}

export function useUserDetailQuery(id: number | undefined, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: userKeys.detail(id ?? 0),
        queryFn: () => userApi.getUserDetail(id as number),
        staleTime: 60_000,
        enabled: Boolean(id) && options?.enabled !== false,
    });
}

export function useAffiliateDetailQuery(id: number | undefined, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: userKeys.affiliateDetail(id ?? 0),
        queryFn: () => userApi.getAffiliateDetail(id as number),
        staleTime: 60_000,
        enabled: Boolean(id) && options?.enabled !== false,
    });
}

export function useAccountInfoQuery(id: number | undefined, infoType: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: userKeys.accountInfo(id ?? 0, infoType),
        queryFn: () => userApi.getAccountInfo(id as number, infoType),
        staleTime: 60_000,
        enabled: Boolean(id) && Boolean(infoType) && options?.enabled !== false,
    });
}
