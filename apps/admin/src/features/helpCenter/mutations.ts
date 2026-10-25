import { useMutation, useQueryClient } from "@tanstack/react-query";
import { helpCenterApi, type FaqPayload } from "./api";
import { helpCenterKeys } from "./queries";

function useRefresh() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: helpCenterKeys.all() });
}

export function useSaveFaqMutation() {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: FaqPayload }) =>
      id ? helpCenterApi.update(id, payload) : helpCenterApi.create(payload),
    onSuccess: refresh,
  });
}

export function useDeleteFaqMutation() {
  const refresh = useRefresh();
  return useMutation({ mutationFn: helpCenterApi.remove, onSuccess: refresh });
}

export function useReorderFaqsMutation() {
  const refresh = useRefresh();
  return useMutation({ mutationFn: helpCenterApi.reorder, onSuccess: refresh });
}
