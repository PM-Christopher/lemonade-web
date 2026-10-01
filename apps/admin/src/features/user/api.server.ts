// Server-side twin of api.ts's client endpoints — for prefetching in a
// Server Component. Same pattern as apps/frontend's api.server.ts files:
// only the endpoints actually prefetched, using backendApi
// (direct-to-backend) instead of browserApi (BFF-proxy, client-only).
import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminUsersRoutes, buildPath } from "@lemonade/api-types/generated";
import type {
  UserListResponse,
  UserDetailResponse,
  AccountInfoResponse,
  AffiliateDetailResponse,
} from "./api";

export const userServerApi = {
  // page omitted -> the old unpaginated shape (see docs/ARCHITECTURE.md §22
  // Conflict 1) — used when the page is first requested with a search/status
  // filter already in the URL, so client-side filtering has every user to
  // search, not just one page of it.
  getUsers: (pagination?: { page?: number; perPage?: number }) =>
    backendApi.get<UserListResponse>(adminUsersRoutes.LIST, {
      params: pagination?.page
        ? { page: pagination.page, per_page: pagination.perPage }
        : undefined,
    }),

  getUserDetail: (id: number | string) =>
    backendApi.get<UserDetailResponse>(buildPath(adminUsersRoutes.SHOW, { id })),

  // Mirrors the default-tab case in api.ts's getAccountInfo switch
  // ("activities-log" -> user-logs) — only the default tab is prefetched,
  // same "prefetch only the default tab" rule as the tabbed list pages.
  getAccountInfoDefault: (id: number | string) =>
    backendApi.get<AccountInfoResponse>(buildPath(adminUsersRoutes.LOGS, { id })),

  getAffiliateDetail: (id: number | string) =>
    backendApi.get<AffiliateDetailResponse>(buildPath(adminUsersRoutes.AFFILIATES_DETAIL, { id })),
};
