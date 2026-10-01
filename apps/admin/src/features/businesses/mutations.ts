import { useMutation, useQueryClient } from "@tanstack/react-query";
import { businessesApi, type RejectOrSuspendPayload } from "./api";
import { businessKeys } from "./queries";

// Every mutation invalidates the list (and, for detail-page actions, the
// detail key too) in onSuccess — see the comment in features/team/mutations.ts
// for why that matters: without it, a moderation action doesn't show up
// until a manual reload.

export function useApproveBusinessMutation(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => businessesApi.approveBusiness(id as string),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: businessKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
}

export function useRejectBusinessMutation(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RejectOrSuspendPayload) =>
      businessesApi.rejectBusiness(id as string, payload),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: businessKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
}

export function useSuspendBusinessMutation(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RejectOrSuspendPayload) =>
      businessesApi.suspendBusiness(id as string, payload),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: businessKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
}

export function useReactivateBusinessMutation(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => businessesApi.reactivateBusiness(id as string),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: businessKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
}

export function useDeleteBusinessMutation(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => businessesApi.deleteBusiness(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
}
