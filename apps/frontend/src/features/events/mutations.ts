import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  eventsApi,
  type BuyTicketPayload,
  type CreateEventPayload,
  type EditEventTicketsPayload,
  type FilterEventsPayload,
  type GuestListResponse,
  type PayForPromotionPayload,
  type UpdateEventPayload,
} from "./api";
import { eventKeys } from "./queries";

export function useCreateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventPayload) => eventsApi.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.organizerList() });
    },
  });
}

export function useUpdateEventMutation(id: number | string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEventPayload) => eventsApi.updateEvent(id as number, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.organizerList() });
      if (id) queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
    },
  });
}

export function usePublishEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => eventsApi.publishEvent(id),
    onSuccess: () => {
      // The organizer list partitions drafts/upcoming itself server-side —
      // simpler and less error-prone to refetch than to move the event
      // between cached buckets by hand, matching business's
      // markJobCompleted precedent for the same class of state change.
      queryClient.invalidateQueries({ queryKey: eventKeys.organizerList() });
    },
  });
}

export function useEditEventTicketsMutation(id: number | string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditEventTicketsPayload) => eventsApi.editEventTickets(id as number, data),
    onSuccess: () => {
      if (id) {
        queryClient.invalidateQueries({ queryKey: eventKeys.tickets(id) });
        queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      }
    },
  });
}

// The caller reads `.data` directly rather than a separate filteredEvents
// cache entry — same reasoning as tribes' searchTribe/viewProfile.
export function useFilterEventsMutation() {
  return useMutation({
    mutationFn: (data: FilterEventsPayload) => eventsApi.filterEvents(data),
  });
}

export function useSearchEventsMutation() {
  return useMutation({
    mutationFn: (search: string) => eventsApi.searchEvents({ search }),
  });
}

export function useGenerateAffiliateLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => eventsApi.generateAffiliateLink(id),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.affiliateEventDetail(id) });
    },
  });
}

export function useSearchAffiliateEventsMutation() {
  return useMutation({
    mutationFn: (search: string) => eventsApi.searchAffiliateEvents({ search }),
  });
}

export function usePayForPromotionMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: PayForPromotionPayload }) =>
      eventsApi.payForPromotion(id, data),
  });
}

// A per-click lookup triggered from the "promoted" badge — not cacheable
// list/detail state, same pattern as tribes' useViewProfileMutation.
export function useEventPromotionMutation() {
  return useMutation({
    mutationFn: ({ id, promotionId }: { id: number | string; promotionId: number | string }) =>
      eventsApi.getEventPromotion(id, promotionId),
  });
}

export function useCheckInGuestMutation(id: number | string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (guestId: number | string) => eventsApi.checkInGuest(id as number, guestId),
    onSuccess: (result) => {
      if (!id) return;
      const guest = result.guest_details as { id: number };

      queryClient.setQueryData(eventKeys.guestDetails(id, guest.id), result);
      queryClient.setQueryData<GuestListResponse>(eventKeys.guestList(id), (old) => {
        if (!old) return old;
        const index = old.guest_list.findIndex((g) => g.id === guest.id);
        if (index === -1) return old;
        const guest_list = [...old.guest_list];
        guest_list[index] = { ...guest_list[index], checked_in: true };
        return { guest_list };
      });
    },
  });
}

export function useBuyTicketMutation() {
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: number | string; data: BuyTicketPayload }) =>
      eventsApi.buyTicket(eventId, data),
  });
}

export function useUpdatePaymentSettingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { type: string }) => eventsApi.updatePaymentSetting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.paymentSetting() });
    },
  });
}
