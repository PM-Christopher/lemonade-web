import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tribesApi } from "./api";
import { tribeKeys } from "./queries";
import type { AddTribeThreadInput, CreateTribeInput } from "./schema";

// Every mutation invalidates its own query key(s) on success — see the
// comment in features/team/mutations.ts for why (the old thunk-based modals
// never refreshed the list/detail after a write, so nothing showed up
// without a manual reload).

export function useCreateTribeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTribeInput) => tribesApi.createTribe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tribeKeys.lists() });
    },
  });
}

export function useAddTribeThreadMutation(tribeId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddTribeThreadInput) => tribesApi.addThread(tribeId as string, data),
    onSuccess: () => {
      if (tribeId) queryClient.invalidateQueries({ queryKey: tribeKeys.detail(tribeId) });
    },
  });
}

export function useDeleteTribeThreadMutation(tribeId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (threadId: string) => tribesApi.deleteThread(threadId),
    onSuccess: () => {
      if (tribeId) queryClient.invalidateQueries({ queryKey: tribeKeys.detail(tribeId) });
    },
  });
}

export function useRemoveTribeMemberMutation(tribeId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => tribesApi.removeMember(tribeId as string, userId),
    onSuccess: () => {
      if (tribeId) queryClient.invalidateQueries({ queryKey: tribeKeys.detail(tribeId) });
    },
  });
}

export function useRestrictTribeMutation(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => tribesApi.restrictTribe(id as string),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: tribeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: tribeKeys.lists() });
    },
  });
}

export function useReactivateTribeMutation(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => tribesApi.reactivateTribe(id as string),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: tribeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: tribeKeys.lists() });
    },
  });
}

export function useDeleteTribeMutation(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => tribesApi.deleteTribe(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tribeKeys.lists() });
    },
  });
}
