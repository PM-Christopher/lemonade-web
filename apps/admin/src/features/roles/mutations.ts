import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesApi, type RolePayload } from "./api";
import { roleKeys } from "./queries";

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: roleKeys.all() });
  return useMutation({
    mutationFn: (payload: RolePayload) => rolesApi.create(payload),
    onSuccess: refresh,
  });
}

export function useUpdateRoleMutation(id: number | string | undefined) {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: roleKeys.all() });
  return useMutation({
    mutationFn: (payload: RolePayload) => rolesApi.update(id as number | string, payload),
    onSuccess: refresh,
  });
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: roleKeys.all() });
  return useMutation({
    mutationFn: (input: { id: number | string; reassignTo?: number | string }) =>
      rolesApi.remove(input.id, input.reassignTo),
    onSuccess: refresh,
  });
}
