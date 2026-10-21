import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supportApi } from "./api";
import { supportKeys } from "./queries";

// Every change reloads the inbox so counts and lists stay true.
export function useUpdateConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (change: {
      userId: string;
      action: "resolve" | "reopen" | "assign" | "unassign";
    }): Promise<unknown> => {
      switch (change.action) {
        case "resolve":
          return supportApi.resolve(change.userId);
        case "reopen":
          return supportApi.reopen(change.userId);
        case "assign":
          return supportApi.assign(change.userId);
        default:
          return supportApi.assign(change.userId, null);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.all() });
    },
  });
}

export function useSaveReplyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title, body }: { id?: string; title: string; body: string }) =>
      id ? supportApi.updateReply(id, { title, body }) : supportApi.createReply({ title, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.replies() });
    },
  });
}

export function useDeleteReplyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => supportApi.deleteReply(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.replies() });
    },
  });
}
