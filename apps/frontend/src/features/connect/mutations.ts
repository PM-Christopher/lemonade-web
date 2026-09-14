import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectApi, type SendInvitePayload } from "./api";
import { connectKeys } from "./queries";

export function useSendChatMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ receiverId, message, media }: { receiverId: number | null; message: string | null; media: string[] }) =>
            connectApi.sendChat(receiverId, message, media),
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
        mutationFn: ({ id, option }: { id: number; option: "accepted" | "rejected" }) => connectApi.inviteResponse(id, option),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: connectKeys.invites() });
        },
    });
}

// Not cacheable server state — a one-shot search action, same pattern as
// admin's affiliate/event lookups this session.
export function useFindUserMutation() {
    return useMutation({
        mutationFn: (search: string) => connectApi.findUser(search),
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
