// Endpoints for the connect domain over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { userConnectRoutes, userMessagesRoutes, buildPath } from "@lemonade/api-types/generated";
import { sharedApi } from "@/features/shared";
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
  id: string;
  message: string;
  sender: string;
  receiver: string;
  media: string[] | null;
  created_at: string;
}

export interface SendChatResponse {
  message: string;
  new_message: OutgoingChatMessage;
}

export interface ChatInvite {
  id: string;
  fullname: string;
  invitee: {
    lemon_id_short: string;
    lemon_id_full: string;
    username: string;
    industry: string | null;
    bio: string | null;
  };
  message: string | null;
  // Whole km from the viewer, computed by the backend; null when unknown.
  distance_km: number | null;
}

export interface InvitesResponse {
  invites: ChatInvite[];
}

export interface InviteResponseResult {
  message: string;
}

export interface FoundUser {
  id: string;
  fullname: string;
  username: string;
  industry: string | null;
  lemon_id: string;
  short_lemon_id: string;
  long_lemon_id: string;
  bio: string | null;
  socials: Array<{ name: string; value: string }>;
  profile_image: string | null;
  // Whole km from the viewer, computed by the backend; null when unknown.
  distance_km: number | null;
  hasConnected: boolean;
}

export interface SendInvitePayload {
  invitee_id: string;
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
  getChat: (receiverId: string) =>
    browserApi.get<ChatDetailResponse>(userMessagesRoutes.CHAT, {
      params: { receiver_id: receiverId },
    }),

  sendChat: (receiverId: string | null, message: string | null, media: string[]) =>
    browserApi.post<SendChatResponse>(
      userMessagesRoutes.SEND,
      { message, media },
      { params: { receiver_id: receiverId } },
    ),

  inviteResponse: (id: string, option: "accepted" | "rejected") =>
    browserApi.post<InviteResponseResult>(buildPath(userConnectRoutes.INVITES_RESPOND, { id }), {
      option,
    }),

  findUser: (search: string) =>
    browserApi.get<FoundUser[]>(userConnectRoutes.FIND_USER, { params: { search } }),

  sendInvite: (data: SendInvitePayload) =>
    browserApi.post<SendInviteResponse>(userConnectRoutes.INVITES_SEND, data),

  getInvites: () => browserApi.get<InvitesResponse>(userConnectRoutes.INVITES_LIST),

  getConnection: () => browserApi.get<ConnectionInfo>(userConnectRoutes.INDEX),

  getMessages: () => browserApi.get<ChatHistoryResponse>(userMessagesRoutes.HISTORY),

  updateVisibility: (visible: boolean) =>
    browserApi.patch<UpdateVisibilityResponse>(userConnectRoutes.UPDATE_VISIBILITY, {
      visibility: visible,
    }),

  // Delegates to the one real implementation in features/shared/api.ts —
  // this domain doesn't own the upload endpoint, it just needs it too.
  uploadMultiple: (formData: FormData) => sharedApi.uploadMultipleFiles(formData),
};
