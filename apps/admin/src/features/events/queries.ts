import { useQuery } from "@tanstack/react-query";
import { eventsApi, promotionsApi } from "./api";

export const eventKeys = {
    all: () => ["event"] as const,
    lists: () => [...eventKeys.all(), "list"] as const,
    list: (trxType: string) => [...eventKeys.lists(), trxType] as const,
    details: () => [...eventKeys.all(), "detail"] as const,
    detail: (id: number) => [...eventKeys.details(), id] as const,
};

export const promotionKeys = {
    all: () => ["promotion"] as const,
    lists: () => [...promotionKeys.all(), "list"] as const,
    details: () => [...promotionKeys.all(), "detail"] as const,
    detail: (id: number) => [...promotionKeys.details(), id] as const,
};

// Events list/detail/affiliates/promotions-queue are moderation/oversight
// data — the "operational queues" bucket from CLAUDE.md's staleness table.
export function useEventListQuery(trxType: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: eventKeys.list(trxType),
        queryFn: () => eventsApi.getEventData(trxType),
        staleTime: 30_000,
        enabled: options?.enabled,
    });
}

export function useEventDetailQuery(id: number | undefined, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: eventKeys.detail(id ?? 0),
        queryFn: () => eventsApi.getEventDetail(id as number),
        staleTime: 30_000,
        enabled: Boolean(id) && options?.enabled !== false,
    });
}

// The promotions catalog (add-promotions page) is an admin-managed content
// catalog, not a moderation queue — treated like team/announcements'
// "user-owned content" bucket (60s) rather than the 30s operational one.
export function usePromotionListQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: promotionKeys.lists(),
        queryFn: promotionsApi.getPromotions,
        staleTime: 60_000,
        enabled: options?.enabled,
    });
}

export function usePromotionDetailQuery(id: number | undefined, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: promotionKeys.detail(id ?? 0),
        queryFn: () => promotionsApi.getPromotion(id as number),
        staleTime: 60_000,
        enabled: Boolean(id) && options?.enabled !== false,
    });
}
