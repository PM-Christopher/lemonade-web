import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, type SupportMessagePayload } from "./api";
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

export function useSendSupportMessageMutation(id: string | number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SupportMessagePayload) =>
      userApi.sendSupportMessage(id as string | number, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...userKeys.all(), "support-chat", id] });
    },
  });
}

// Uploads every picked file at once and returns their addresses in the same order.
export function useUploadChatMediaMutation() {
  return useMutation({
    mutationFn: (files: File[]) => Promise.all(files.map((file) => userApi.uploadChatMedia(file))),
  });
}
