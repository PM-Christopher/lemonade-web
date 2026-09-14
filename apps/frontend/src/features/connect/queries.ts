import { useQuery, type QueryClient } from "@tanstack/react-query";
import { connectApi, type ChatDetailResponse, type OutgoingChatMessage } from "./api";

export const connectKeys = {
    all: () => ["connect"] as const,
    chats: () => [...connectKeys.all(), "chats"] as const,
    chat: (receiverId: number) => [...connectKeys.all(), "chat", receiverId] as const,
    invites: () => [...connectKeys.all(), "invites"] as const,
    connection: () => [...connectKeys.all(), "connection"] as const,
};

// Message history (sidebar) and an open chat — not money, but live/social
// data; CLAUDE.md's "user-owned content" bucket (60s) governs background
// refetch, real-time updates arrive separately via appendIncomingChatMessage.
export function useChatHistoryQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: connectKeys.chats(),
        queryFn: connectApi.getMessages,
        staleTime: 60_000,
        enabled: options?.enabled,
    });
}

export function useChatQuery(receiverId: number | undefined, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: connectKeys.chat(receiverId ?? 0),
        queryFn: () => connectApi.getChat(receiverId as number),
        staleTime: 60_000,
        enabled: Boolean(receiverId) && options?.enabled !== false,
    });
}

// Pending connection requests — an actionable queue, closer to CLAUDE.md's
// "operational queues" bucket (30s) than plain user content.
export function useInvitesQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: connectKeys.invites(),
        queryFn: connectApi.getInvites,
        staleTime: 30_000,
        enabled: options?.enabled,
    });
}

export function useConnectionQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: connectKeys.connection(),
        queryFn: connectApi.getConnection,
        staleTime: 60_000,
        enabled: options?.enabled,
    });
}

/**
 * Called from hooks/usePusher.ts on every "message.sent" push for the
 * current user's `chat.{userId}` channel. Replaces the old
 * connect.slice.ts's addToMessages reducer, which appended unconditionally
 * to whatever chat happened to be open in Redux — that was only ever
 * correct because the UI shows one open chat at a time; a message pushed
 * for a *different* conversation while chat A was open would have landed
 * in chat A's message list. This version computes the actual other party
 * from the message itself and writes into that specific chat's cache entry
 * (a no-op if that chat isn't currently cached), so it's correct regardless
 * of what's open.
 */
export function appendIncomingChatMessage(queryClient: QueryClient, currentUserId: number, raw: OutgoingChatMessage): void {
    const otherPartyId = raw.sender === currentUserId ? raw.receiver : raw.sender;

    queryClient.setQueryData<ChatDetailResponse>(connectKeys.chat(otherPartyId), (old) => {
        if (!old) return old;

        return {
            ...old,
            messages: [
                ...old.messages,
                {
                    id: raw.id,
                    message: raw.message,
                    sender: raw.sender === currentUserId,
                    receiver: raw.receiver === currentUserId,
                    media: raw.media,
                    created_at: raw.created_at,
                },
            ],
        };
    });
}
