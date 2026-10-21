// Endpoints for the admin support inbox over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminSupportRoutes, buildPath } from "@lemonade/api-types/generated";

export interface SupportConversation {
  user: { id: string; name: string; image: string | null; email: string };
  status: "open" | "resolved";
  assignee: { id: string; name: string } | null;
  // Messages from the user the team has not read.
  unread: number;
  last_message: { text: string; from: "user" | "admin" | null; at: string | null };
  // The user wrote last, so they are waiting for an answer.
  waiting_for_reply: boolean;
}

export interface SupportInboxFilters {
  status?: string;
  unread?: boolean;
  assignee?: string;
  search?: string;
}

export interface SupportInboxResponse {
  counts: { open: number; unread: number; resolved: number; mine: number };
  conversations: SupportConversation[];
}

export interface SavedReply {
  id: string;
  title: string;
  body: string;
}

export const supportApi = {
  getInbox: (filters: SupportInboxFilters) =>
    browserApi.get<SupportInboxResponse>(adminSupportRoutes.INBOX, {
      params: { ...filters, unread: filters.unread ? 1 : undefined },
    }),

  resolve: (userId: string) =>
    browserApi.patch<{ status: string }>(buildPath(adminSupportRoutes.RESOLVE, { userId }), {}),

  reopen: (userId: string) =>
    browserApi.patch<{ status: string }>(buildPath(adminSupportRoutes.REOPEN, { userId }), {}),

  // Leave `adminId` out to take the conversation yourself; pass null to hand it back.
  assign: (userId: string, adminId?: string | null) =>
    browserApi.patch<{ assigned_to: string | null }>(
      buildPath(adminSupportRoutes.ASSIGN, { userId }),
      adminId === undefined ? {} : { admin_id: adminId },
    ),

  getReplies: () => browserApi.get<{ replies: SavedReply[] }>(adminSupportRoutes.REPLIES_LIST),

  createReply: (data: { title: string; body: string }) =>
    browserApi.post<{ reply: SavedReply }>(adminSupportRoutes.REPLIES_CREATE, data),

  updateReply: (id: string, data: { title: string; body: string }) =>
    browserApi.put<{ reply: SavedReply }>(
      buildPath(adminSupportRoutes.REPLIES_UPDATE, { id }),
      data,
    ),

  deleteReply: (id: string) =>
    browserApi.delete<{ deleted: boolean }>(buildPath(adminSupportRoutes.REPLIES_DELETE, { id })),
};
