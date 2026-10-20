import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "./api";
import { userKeys } from "./queries";

export function useSuspendUserMutation(id: string | number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason: string) => userApi.suspendUser(id as string | number, reason),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useDeactivateUserMutation(id: string | number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason: string) => userApi.deactivateUser(id as string | number, reason),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useReactivateUserMutation(id: string | number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.reactivateUser(id as string | number),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useChangePlanMutation(id: string | number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { subscription_id: string; type?: string }) =>
      userApi.changePlan(id as string | number, payload),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: [...userKeys.all(), "account-plan"] });
    },
  });
}

export function useCancelPlanMutation(id: string | number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.cancelPlan(id as string | number),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: [...userKeys.all(), "account-plan"] });
    },
  });
}
