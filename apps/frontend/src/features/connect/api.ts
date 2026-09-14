// Endpoint layer for the connect (chat/connections) domain — see
// features/settings/api.ts for the pattern this follows: the BFF proxy
// transport (browserApi), not the pre-BFF axiosInstance.
import { browserApi } from "@/lib/browser-api";
import { userConnectRoutes } from "@lemonade/api-types";
import { sharedApi } from "@/features/shared/api";
import type { ChatInterface, MessageInterface } from "@/interfaces/ChatInterface";

export interface ChatDetailResponse {
    chat: ChatInterface;
    messages: MessageInterface[];
}

export interface ChatHistoryResponse {
    chats: ChatInterface[];
}

// Shape sent over the wire by both the send-chat REST response and the
// Pusher "message.sent" push (OutgoingChatMessageResource on the backend) —
// sender/receiver are raw user ids here, unlike MessageInterface's
// viewer-relative booleans (ChatMessageResource, used by getChat/history).
export interface OutgoingChatMessage {
    id: number;
    message: string;
    sender: number;
    receiver: number;
    media: string[] | null;
    created_at: string;
}

export interface SendChatResponse {
    message: string;
    new_message: OutgoingChatMessage;
}

export interface ChatInvite {
    id: number;
    fullname: string;
    invitee: {
        lemon_id_short: string;
        lemon_id_full: string;
        username: string;
        industry: string | null;
        bio: string | null;
    };
    message: string | null;
    location: { longitude: number | null; latitude: number | null };
}

export interface InvitesResponse {
    invites: ChatInvite[];
}

export interface InviteResponseResult {
    message: string;
}

export interface FoundUser {
    id: number;
    fullname: string;
    username: string;
    industry: string | null;
    lemon_id: string;
    short_lemon_id: string;
    long_lemon_id: string;
    bio: string | null;
    socials: Array<{ name: string; value: string }>;
    profile_image: string | null;
    connect_info: {
        longitude: number | null;
        latitude: number | null;
        location: string | null;
        visibility: boolean | null;
    };
    hasConnected: boolean;
}

export interface SendInvitePayload {
    invitee_id: number;
    message?: string;
}

export interface SendInviteResponse {
    invite_sent: ChatInvite;
}

export interface ConnectionInfo {
    user: {
        fullname: string;
        username: string;
        industry: string | null;
        lemon_id_short: string;
        lemon_id_full: string;
        longitude: number | null;
        latitude: number | null;
        // Confirmed live: the backend returns these as raw DB values
        // (0/1, not real booleans; location is a raw column too, not a
        // formatted string) — not narrowed further since nothing in the
        // frontend reads `location`, and `visibility` is only ever used
        // truthily.
        visibility: boolean | number;
        location: unknown;
    };
    visible_users: unknown[];
}

export interface UpdateVisibilityResponse {
    user_connect_info: unknown;
}

export const connectApi = {
    getChat: (receiverId: number) =>
        browserApi.get<ChatDetailResponse>(`${userConnectRoutes.MESSAGES}/chat`, { params: { receiver_id: receiverId } }),

    sendChat: (receiverId: number | null, message: string | null, media: string[]) =>
        browserApi.post<SendChatResponse>(userConnectRoutes.MESSAGES, { message, media }, { params: { receiver_id: receiverId } }),

    inviteResponse: (id: number, option: "accepted" | "rejected") =>
        browserApi.post<InviteResponseResult>(`${userConnectRoutes.BASE}/invite-response/${id}`, { option }),

    findUser: (search: string) => browserApi.get<FoundUser[]>(userConnectRoutes.FIND_USER, { params: { search } }),

    sendInvite: (data: SendInvitePayload) => browserApi.post<SendInviteResponse>(userConnectRoutes.SEND_INVITE, data),

    getInvites: () => browserApi.get<InvitesResponse>(userConnectRoutes.GET_INVITES),

    getConnection: () => browserApi.get<ConnectionInfo>(userConnectRoutes.BASE),

    getMessages: () => browserApi.get<ChatHistoryResponse>(userConnectRoutes.MESSAGES),

    updateVisibility: (visible: boolean) =>
        browserApi.patch<UpdateVisibilityResponse>(userConnectRoutes.UPDATE_VISIBILITY, { visibility: visible }),

    // Delegates to the one real implementation in features/shared/api.ts —
    // this domain doesn't own the upload endpoint, it just needs it too.
    uploadMultiple: (formData: FormData) => sharedApi.uploadMultipleFiles(formData),
};
