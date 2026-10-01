import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "./api";
import { userKeys } from "./queries";

export function useSuspendUserMutation(id: string | number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.suspendUser(id as string | number),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useDeactivateUserMutation(id: string | number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.deactivateUser(id as string | number),
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
