// Endpoint layer for the user domain — see features/team/api.ts for the
// pattern this follows: the BFF proxy transport (browserApi), not the
// pre-BFF axiosInstance.
//
// NOTE (found, not fixed — preserving exact current behavior per this
// migration's own rule): getAccountInfo's "business" case hits the same
// user-logs endpoint as "activities-log". This isn't unfinished routing —
// there's no user-business route registered on the backend at all
// (UserController::userBusiness exists but nothing in routes/v1/admin/users.php
// wires it up), so falling through to user-logs is the only sensible choice.
import { browserApi } from "@/lib/browser-api";
import { adminUsersRoutes, buildPath } from "@lemonade/api-types/generated";

export interface AdminUser {
  id: number;
  unique_id: string;
  lemon_id: string;
  fullname: string;
  username: string;
  profile_image: string | null;
  email: string;
  account_plan: string | null;
  location: string | null;
  date_joined: string;
  status: string;
  social_links: Array<{ name: string; value: string }>;
  referrals: number;
  tribes_joined: number;
  tribes_created: number;
  threads_created: number;
  business: string;
  events_created: number;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface UserListResponse {
  users: AdminUser[];
  meta?: PaginationMeta;
}

export interface AffiliateListItem {
  id: number;
  unique_id: string;
  name: string;
  total_referrals: number;
  subscribed_referrals: number;
  earnings: number;
}

export interface TopReferrer {
  name: string;
  total_earnings: number;
}

export interface AffiliateListResponse {
  total_referral_earnings: number;
  total_referrers: number;
  total_referrals: number;
  affiliates: AffiliateListItem[];
  top_referrers: TopReferrer[];
}

export interface UserDetailResponse {
  user: AdminUser;
}

export interface UserAffiliateDetail {
  id: number;
  unique_id: string;
  image: string | null;
  name: string;
  referral_code: string;
  status: string;
}

export interface AffiliateDetailResponse {
  detail: UserAffiliateDetail;
  total_amount_earned: number;
  total_referrals: number;
  total_subscribed_referrals: number;
}

export interface UserActivityLog {
  id: number;
  message: string;
  created_at: string;
}

export interface UserTribeSummary {
  id: number;
  name: string;
  image: string | null;
  category: string;
  members: number;
  threads: number;
  created_at: string;
}

export interface UserEventSummary {
  id: number;
  name: string;
  image: string | null;
  date: string;
  time: string;
}

// Shape varies by infoType — tribes/events/wallet/logs each populate a
// different subset of these fields. Mirrors the old thunk's behavior of
// storing all of them under one `userDetail` state slot regardless of type.
export interface AccountInfoResponse {
  logs?: UserActivityLog[];
  tribes?: UserTribeSummary[];
  events?: UserEventSummary[];
  total_amount?: number;
  referral_earning?: number;
  affiliate_earning?: number;
}

export interface UserActionResponse {
  user: AdminUser;
  message?: string;
}

export const userApi = {
  // page/perPage are opt-in on the backend (see docs/ARCHITECTURE.md §22
  // Conflict 1) — omit both to get the old unpaginated shape back, which
  // UsersClient does while a search/status filter is active so client-side
  // filtering still sees every user, not just the current page.
  getUserData: (
    trxType: string,
    pagination?: { page?: number; perPage?: number },
  ): Promise<UserListResponse | AffiliateListResponse> => {
    switch (trxType) {
      case "affiliates":
        return browserApi.get<AffiliateListResponse>(adminUsersRoutes.AFFILIATES_LOG);
      case "users":
      default:
        return browserApi.get<UserListResponse>(adminUsersRoutes.LIST, {
          params: pagination?.page
            ? { page: pagination.page, per_page: pagination.perPage }
            : undefined,
        });
    }
  },

  getUserDetail: (id: string | number) =>
    browserApi.get<UserDetailResponse>(buildPath(adminUsersRoutes.SHOW, { id })),

  // NOTE (found live-testing, not fixed — pre-existing backend bug, not
  // introduced by this migration): the affiliates list is built from the
  // `Referrer` model, but this endpoint looks the id up in the unrelated
  // `Affiliate` table. AffiliateView.tsx links each row to this route using
  // the Referrer id, so most clicks 400 with "Affiliate not found." Same
  // request the old axios code sent — needs a backend/product decision on
  // which model is authoritative, not a frontend fix.
  getAffiliateDetail: (id: string | number) =>
    browserApi.get<AffiliateDetailResponse>(buildPath(adminUsersRoutes.AFFILIATES_DETAIL, { id })),

  // See the NOTE above for the "business" case.
  getAccountInfo: (id: string | number, infoType: string) => {
    switch (infoType) {
      case "tribes":
        return browserApi.get<AccountInfoResponse>(buildPath(adminUsersRoutes.TRIBES, { id }));
      case "events":
        return browserApi.get<AccountInfoResponse>(buildPath(adminUsersRoutes.EVENTS, { id }));
      case "wallet":
        return browserApi.get<AccountInfoResponse>(buildPath(adminUsersRoutes.WALLET, { id }));
      case "activities-log":
      case "business":
      default:
        return browserApi.get<AccountInfoResponse>(buildPath(adminUsersRoutes.LOGS, { id }));
    }
  },

  suspendUser: (id: string | number) =>
    browserApi.patch<UserActionResponse>(buildPath(adminUsersRoutes.SUSPEND, { id }), {}),

  deactivateUser: (id: string | number) =>
    browserApi.patch<UserActionResponse>(buildPath(adminUsersRoutes.DEACTIVATE, { id }), {}),

  reactivateUser: (id: string | number) =>
    browserApi.patch<UserActionResponse>(buildPath(adminUsersRoutes.REACTIVATE, { id }), {}),
};
