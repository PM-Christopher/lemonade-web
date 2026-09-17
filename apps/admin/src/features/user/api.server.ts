// Server-side twin of api.ts's client endpoints — for prefetching in a
// Server Component. Same pattern as apps/frontend's api.server.ts files:
// only the endpoints actually prefetched, using backendApi
// (direct-to-backend) instead of browserApi (BFF-proxy, client-only).
import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminUserRoutes } from "@lemonade/api-types";
import type {
  UserListResponse,
  UserDetailResponse,
  AccountInfoResponse,
  AffiliateDetailResponse,
} from "./api";

export const userServerApi = {
  getUsers: () => backendApi.get<UserListResponse>(adminUserRoutes.BASE),

  getUserDetail: (id: number | string) =>
    backendApi.get<UserDetailResponse>(`${adminUserRoutes.BASE}/${id}`),

  // Mirrors the default-tab case in api.ts's getAccountInfo switch
  // ("activities-log" -> user-logs) — only the default tab is prefetched,
  // same "prefetch only the default tab" rule as the tabbed list pages.
  getAccountInfoDefault: (id: number | string) =>
    backendApi.get<AccountInfoResponse>(
      `${adminUserRoutes.BASE}/${id}/user-logs`,
    ),

  getAffiliateDetail: (id: number | string) =>
    backendApi.get<AffiliateDetailResponse>(
      `${adminUserRoutes.AFFILIATES_DETAIL}/${id}/detail`,
    ),
};
