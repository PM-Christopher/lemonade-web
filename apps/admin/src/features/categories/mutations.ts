import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi, type CategoryPayload } from "./api";
import { categoryKeys } from "./queries";

function useRefresh() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: categoryKeys.all() });
}

export function useSaveCategoryMutation() {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: CategoryPayload }) =>
      id ? categoriesApi.update(id, payload) : categoriesApi.create(payload),
    onSuccess: refresh,
  });
}

export function useDeleteCategoryMutation() {
  const refresh = useRefresh();
  return useMutation({ mutationFn: categoriesApi.remove, onSuccess: refresh });
}
