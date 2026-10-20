import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventPromotionsApi, eventsApi, promotionsApi, type PromotionPayload } from "./api";
import { eventKeys, eventPromotionKeys, promotionKeys } from "./queries";

export function useSuspendEventMutation(id: string | number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason?: string) => eventsApi.suspendEvent(id as string | number, reason),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useActivateEventMutation(id: string | number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => eventsApi.activateEvent(id as string | number),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useApproveEventMutation(id: string | number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => eventsApi.approveEvent(id as string | number),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useRejectEventMutation(id: string | number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason: string) => eventsApi.rejectEvent(id as string | number, reason),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useDeleteEventMutation(id: string | number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason?: string) => eventsApi.deleteEvent(id as string | number, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useUpdateCommissionChargeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commissionCharge: number) => eventsApi.updateCommissionCharge(commissionCharge),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useCreatePromotionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PromotionPayload) => promotionsApi.createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
    },
  });
}

export function useUpdatePromotionMutation(id: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PromotionPayload) => promotionsApi.updatePromotion(id as number, data),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: promotionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
    },
  });
}

export function useDeletePromotionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => promotionsApi.deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
    },
  });
}

export function useScheduleEventPromotionMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promotionDate: string) => eventPromotionsApi.schedule(id, promotionDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventPromotionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useCompleteEventPromotionMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => eventPromotionsApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventPromotionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}
