import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moderationApi, type ModerationContentType } from "./api";
import { moderationKeys } from "./queries";

export function useDeleteModeratedContentMutation(type: ModerationContentType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => moderationApi.deleteContent(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moderationKeys.all() });
    },
  });
}

export function useRestoreModeratedContentMutation(type: ModerationContentType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => moderationApi.restoreContent(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moderationKeys.all() });
    },
  });
}
