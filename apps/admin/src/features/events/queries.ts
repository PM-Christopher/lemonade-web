import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { eventPromotionsApi, eventsApi, promotionsApi } from "./api";

export const eventKeys = {
  all: () => ["event"] as const,
  lists: () => [...eventKeys.all(), "list"] as const,
  list: (trxType: string, search = "") => [...eventKeys.lists(), trxType, search] as const,
  details: () => [...eventKeys.all(), "detail"] as const,
  detail: (id: string | number) => [...eventKeys.details(), id] as const,
  affiliateDetail: (id: string | number) => [...eventKeys.all(), "affiliate-detail", id] as const,
  affiliateSales: (id: string | number) => [...eventKeys.all(), "affiliate-sales", id] as const,
};

export const eventPromotionKeys = {
  all: () => ["event-promotion"] as const,
  detail: (id: string) => [...eventPromotionKeys.all(), "detail", id] as const,
};

export const promotionKeys = {
  all: () => ["promotion"] as const,
  lists: () => [...promotionKeys.all(), "list"] as const,
  details: () => [...promotionKeys.all(), "detail"] as const,
  detail: (id: number) => [...promotionKeys.details(), id] as const,
};

// Events list/detail/affiliates/promotions-queue are moderation/oversight
// data — the "operational queues" bucket from CLAUDE.md's staleness table.
export function useEventListQuery(
  trxType: string,
  options?: { enabled?: boolean; search?: string },
) {
  return useQuery({
    queryKey: eventKeys.list(trxType, options?.search),
    queryFn: () => eventsApi.getEventData(trxType, options?.search),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled: options?.enabled,
  });
}

export function useEventDetailQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: eventKeys.detail(id ?? 0),
    queryFn: () => eventsApi.getEventDetail(id as string | number),
    staleTime: 30_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

export function useEventPromotionQuery(id: string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: eventPromotionKeys.detail(id ?? ""),
    queryFn: () => eventPromotionsApi.getDetail(id as string),
    staleTime: 30_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

export function useEventAffiliateDetailQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: eventKeys.affiliateDetail(id ?? 0),
    queryFn: () => eventsApi.getEventAffiliateDetail(id as string | number),
    staleTime: 30_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

// Tickets sold through one affiliate's links; money data, so always fresh.
export function useEventAffiliateSalesQuery(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: eventKeys.affiliateSales(id ?? 0),
    queryFn: () => eventsApi.getEventAffiliateSales(id as string | number),
    staleTime: 0,
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
