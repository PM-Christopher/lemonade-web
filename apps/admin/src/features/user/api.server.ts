// Server-side twin of api.ts's client endpoints — for prefetching in a
// Server Component. Same pattern as apps/frontend's api.server.ts files:
// only the endpoints actually prefetched, using backendApi
// (direct-to-backend) instead of browserApi (BFF-proxy, client-only).
import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminUserRoutes } from "@lemonade/api-types";
import type { UserListResponse } from "./api";

export const userServerApi = {
  getUsers: () => backendApi.get<UserListResponse>(adminUserRoutes.BASE),
};
