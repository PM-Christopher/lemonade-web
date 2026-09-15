// Server-side twin of api.ts's client endpoints — for prefetching in a
// Server Component. Same pattern as features/events/api.server.ts: only the
// endpoints actually prefetched, using backendApi (direct-to-backend)
// instead of browserApi (BFF-proxy, client-only).
import "server-only";
import { backendApi } from "@/lib/server-api";
import { userConnectRoutes } from "@lemonade/api-types";
import type {
  InvitesResponse,
  ChatHistoryResponse,
  ConnectionInfo,
} from "./api";

export const connectServerApi = {
  getInvites: () =>
    backendApi.get<InvitesResponse>(userConnectRoutes.GET_INVITES),

  getMessages: () =>
    backendApi.get<ChatHistoryResponse>(userConnectRoutes.MESSAGES),

  getConnection: () => backendApi.get<ConnectionInfo>(userConnectRoutes.BASE),
};
