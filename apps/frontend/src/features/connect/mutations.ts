import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectApi, type SendInvitePayload } from "./api";
import { connectKeys } from "./queries";

export function useSendChatMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      receiverId,
      message,
      media,
    }: {
      receiverId: string | null;
      message: string | null;
      media: string[];
    }) => connectApi.sendChat(receiverId, message, media),
    onSuccess: (_data, { receiverId }) => {
      // The message list itself is updated locally by the caller (it
      // already has the new message from the response) — this just
      // refreshes the sidebar's "latest message" preview.
      if (receiverId) queryClient.invalidateQueries({ queryKey: connectKeys.chats() });
    },
  });
}

export function useInviteResponseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, option }: { id: string; option: "accepted" | "rejected" }) =>
      connectApi.inviteResponse(id, option),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectKeys.invites() });
      // An accepted invite adds a chat to the list.
      queryClient.invalidateQueries({ queryKey: connectKeys.chats() });
    },
  });
}

export function useSendInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendInvitePayload) => connectApi.sendInvite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectKeys.invites() });
    },
  });
}

export function useUpdateVisibilityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (visible: boolean) => connectApi.updateVisibility(visible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectKeys.connection() });
    },
  });
}

// Block, unblock, end and delete (clear) a chat. All refresh the open chat and the chat list.
function useChatContactMutation(action: (receiverId: string) => Promise<{ message: string }>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: action,
    onSuccess: (_data, receiverId) => {
      queryClient.invalidateQueries({ queryKey: connectKeys.chat(receiverId) });
      queryClient.invalidateQueries({ queryKey: connectKeys.chats() });
    },
  });
}

export const useBlockUserMutation = () => useChatContactMutation(connectApi.blockUser);
export const useUnblockUserMutation = () => useChatContactMutation(connectApi.unblockUser);
export const useEndChatMutation = () => useChatContactMutation(connectApi.endChat);
export const useClearChatMutation = () => useChatContactMutation(connectApi.clearChat);
