import { useQuery } from "@tanstack/react-query";
import { eventsApi } from "./api";

export const eventKeys = {
  all: () => ["events"] as const,
  list: () => [...eventKeys.all(), "list"] as const,
  detail: (id: number | string) => [...eventKeys.all(), "detail", id] as const,
  tickets: (id: number | string) => [...eventKeys.all(), "tickets", id] as const,
  organizerList: () => [...eventKeys.all(), "organizerList"] as const,
  affiliateEvents: () => [...eventKeys.all(), "affiliateEvents"] as const,
  affiliateEventDetail: (id: number | string) =>
    [...eventKeys.all(), "affiliateEventDetail", id] as const,
  affiliateData: () => [...eventKeys.all(), "affiliateData"] as const,
  ticketData: (id: number | string) => [...eventKeys.all(), "ticketData", id] as const,
  guestList: (id: number | string) => [...eventKeys.all(), "guestList", id] as const,
  guestDetails: (id: number | string, guestId: number | string) =>
    [...eventKeys.all(), "guestDetails", id, guestId] as const,
  guestSearch: (id: number | string, term: string) =>
    [...eventKeys.all(), "guestSearch", id, term] as const,
  promotions: () => [...eventKeys.all(), "promotions"] as const,
  paymentSetting: () => [...eventKeys.all(), "paymentSetting"] as const,
  myTickets: () => [...eventKeys.all(), "myTickets"] as const,
  myTicket: (id: number | string) => [...eventKeys.all(), "myTicket", id] as const,
};

// Public browse (this_week/upcoming/trending) — discovery content, 5m.
export function useEventsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: eventKeys.list(),
    queryFn: eventsApi.getEvents,
    staleTime: 5 * 60_000,
    enabled: options?.enabled,
  });
}

export function useEventQuery(id: number | string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: eventKeys.detail(id ?? 0),
    queryFn: () => eventsApi.getEvent(id as number),
    staleTime: 60_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

// The organizer's own tickets for a specific event (add-ticket page).
export function useEventTicketsQuery(
  id: number | string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: eventKeys.tickets(id ?? 0),
    queryFn: () => eventsApi.getEventTickets(id as number),
    staleTime: 60_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

// The organizer's own events (upcoming/past/drafts/pending/rejected).
export function useOrganizerEventsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: eventKeys.organizerList(),
    queryFn: eventsApi.getOrganizerEvents,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

export function useAffiliateEventsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: eventKeys.affiliateEvents(),
    queryFn: eventsApi.getAffiliateEvents,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

// Agent-facing event detail + the viewer's own affiliate breakdown for it
// (frontend's own thunk called this getProgram).
export function useAffiliateEventDetailQuery(
  id: number | string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: eventKeys.affiliateEventDetail(id ?? 0),
    queryFn: () => eventsApi.getAffiliateEvent(id as number),
    staleTime: 60_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

// The affiliate's own commission/tickets-sold totals — money-adjacent,
// CLAUDE.md's 0 bucket, same bar as wallet.
export function useAffiliateDataQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: eventKeys.affiliateData(),
    queryFn: eventsApi.getAffiliateData,
    staleTime: 0,
    enabled: options?.enabled,
  });
}

// Public ticket listing for the buy-ticket flow — stock changes as people
// buy, so kept short (operational queue bucket).
export function useEventTicketDataQuery(
  id: number | string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: eventKeys.ticketData(id ?? 0),
    queryFn: () => eventsApi.getEventTicketData(id as number),
    staleTime: 30_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

export function useGuestListQuery(
  id: number | string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: eventKeys.guestList(id ?? 0),
    queryFn: () => eventsApi.getGuestList(id as number),
    staleTime: 30_000,
    enabled: Boolean(id) && options?.enabled !== false,
  });
}

export function useGuestDetailsQuery(
  id: number | string | undefined,
  guestId: number | string | null | undefined,
) {
  return useQuery({
    queryKey: eventKeys.guestDetails(id ?? 0, guestId ?? 0),
    queryFn: () => eventsApi.getGuestListDetails(id as number, guestId as number),
    staleTime: 30_000,
    enabled: Boolean(id) && Boolean(guestId),
  });
}

// Search-as-you-type over the guest list — the caller debounces the term
// and passes it in; disabled entirely on an empty term.
export function useGuestSearchQuery(id: number | string | undefined, term: string) {
  return useQuery({
    queryKey: eventKeys.guestSearch(id ?? 0, term),
    queryFn: () => eventsApi.guestSearch(id as number, term),
    staleTime: 0,
    enabled: Boolean(id) && term.trim().length > 0,
  });
}

export function usePromotionsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: eventKeys.promotions(),
    queryFn: eventsApi.getPromotions,
    staleTime: 5 * 60_000,
    enabled: options?.enabled,
  });
}

export function usePaymentSettingQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: eventKeys.paymentSetting(),
    queryFn: eventsApi.getPaymentSetting,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

export function useMyTicketsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: eventKeys.myTickets(),
    queryFn: eventsApi.getMyTickets,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

export function useMyTicketQuery(id: number | string | undefined) {
  return useQuery({
    queryKey: eventKeys.myTicket(id ?? 0),
    queryFn: () => eventsApi.getMyTicket(id as number),
    staleTime: 60_000,
    enabled: Boolean(id),
  });
}
