import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi, promotionsApi, type PromotionPayload } from "./api";
import { eventKeys, promotionKeys } from "./queries";

export function useSuspendEventMutation(id: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => eventsApi.suspendEvent(id as number),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useActivateEventMutation(id: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => eventsApi.activateEvent(id as number),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useDeleteEventMutation(id: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => eventsApi.deleteEvent(id as number),
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
