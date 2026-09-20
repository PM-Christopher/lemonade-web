import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi, type SubscriptionPlanPayload } from "./api";
import { subscriptionKeys } from "./queries";

export function useCreatePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubscriptionPlanPayload) => subscriptionsApi.createPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
  });
}

export function useUpdatePlanMutation(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubscriptionPlanPayload) =>
      subscriptionsApi.updatePlan(id as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
  });
}

export function useActivatePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.activatePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
  });
}

export function useDeactivatePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.deactivatePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
  });
}

export function useDeletePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
  });
}
