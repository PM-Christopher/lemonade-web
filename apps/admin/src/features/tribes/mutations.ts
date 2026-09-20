import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tribesApi } from "./api";
import { tribeKeys } from "./queries";

// Every mutation invalidates its own query key(s) on success — see the
// comment in features/team/mutations.ts for why (the old thunk-based modals
// never refreshed the list/detail after a write, so nothing showed up
// without a manual reload).

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
