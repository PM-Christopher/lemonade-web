// Endpoints for the user domain over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminUsersRoutes, adminUtilitiesRoutes, buildPath } from "@lemonade/api-types/generated";

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
  business: string | null;
  events_created: number;
  // Why the account was suspended or deactivated.
  status_reason: string | null;
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
  id: string;
  message: string;
  created_at: string;
  created_at_iso: string;
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
  // Whether the event is still to come.
  upcoming?: boolean;
}

// Shape varies by infoType — tribes/events/wallet/logs each populate a
// different subset of these fields. Mirrors the old thunk's behavior of
// storing all of them under one `userDetail` state slot regardless of type.
export interface AccountInfoResponse {
  logs?: UserActivityLog[];
  meta?: PaginationMeta;
  tribes?: UserTribeSummary[];
  events?: UserEventSummary[];
  total_amount?: number;
  // Spendable wallet balance, in naira.
  wallet_balance?: number;
  referral_earning?: number;
  affiliate_earning?: number;
  // Naira, from the backend's tribe ledger.
  monetized_tribes?: number;
}

export interface UserTribeHistoryItem {
  amount_minor: number;
  amount: string;
  title: string;
  member: string | null;
  tribe_name: string | null;
  created: string;
}

export interface UserTribeHistoryResponse {
  tribe_history: UserTribeHistoryItem[];
}

export interface UserBusiness {
  id: string;
  name: string;
  image: string | null;
  description: string;
  categories: string[];
  services: string[];
  // Server-formatted naira per hour.
  service_rate_naira: string | null;
  city: string;
  country: string;
  email: string;
  phone_number: string;
  website_url: string | null;
  gallery: string[];
  status: string;
  rating: number;
  boosted: boolean;
}

export interface UserBusinessResponse {
  business: UserBusiness | null;
}

export interface UserTribeMember {
  id: string;
  user_id: string;
  user: { id: string; fullname: string; username: string; profile_image: string | null } | null;
}

export interface UserTribeThread {
  id: string;
  topic: string;
  thoughts: string;
  created_at: string;
  media?: string[] | null;
  user?: { fullname: string; username: string; profile_image: string | null } | null;
}

export interface UserTribeDetail {
  id: string;
  name: string;
  image: string | null;
  category: string;
  description: string;
  private: boolean;
  monetized: boolean;
  membership_fee: string;
  members_count: number;
  threads_count: number;
  created_at: string;
  creator: { id: string; name: string; image: string | null } | null;
  members: UserTribeMember[];
  threads: UserTribeThread[];
}

export interface UserTribeDetailResponse {
  tribe_info: UserTribeDetail;
}

export interface AccountPlanSummary {
  title: string | null;
  type: string;
  status: string;
  amount_minor: number;
  // Server-formatted naira.
  amount: string;
  renews_at: string | null;
  auto_renew: boolean;
  card: { brand: string | null; last4: string } | null;
}

export interface AccountPlanHistoryItem {
  id: string;
  txn_id: string;
  name: string;
  amount: string;
  created_at: string;
}

export interface AccountPlanResponse {
  current: AccountPlanSummary | null;
  subscription_history: AccountPlanHistoryItem[];
}

export interface PayoutHistoryItem {
  amount: string;
  status: string;
  date: string;
}

export interface PayoutHistoryResponse {
  payout_history: PayoutHistoryItem[];
}

export interface ReferralHistoryItem {
  amount: string;
  type: string;
  created_at: string;
}

export interface ReferralHistoryResponse {
  referral_history: ReferralHistoryItem[];
}

export interface AffiliateHistoryItem {
  amount: string;
  created_at: string;
}

export interface AffiliateHistoryResponse {
  affiliate_history: AffiliateHistoryItem[];
}

export interface SupportMedia {
  type: "image" | "video";
  url: string;
}

export interface SupportMessage {
  id: string;
  sender: "admin" | "user";
  message: string | null;
  media: SupportMedia[];
  read_at: string | null;
  created_at: string;
}

export interface SupportMessagesResponse {
  messages: SupportMessage[];
}

export interface SupportMessagePayload {
  message?: string;
  media?: SupportMedia[];
}

export interface UserActionResponse {
  user: AdminUser;
  message?: string;
}

// Optional filters for the activity log and events tabs.
export interface AccountInfoParams {
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
  // Events: all, upcoming or ended.
  filter?: string;
}

export const userApi = {
  // page/perPage are opt-in on the backend (see docs/ARCHITECTURE.md §22
  // Conflict 1) — omit both to get the old unpaginated shape back, which
  // UsersClient does while a search/status filter is active so client-side
  // filtering still sees every user, not just the current page.
  getUserData: (
    trxType: string,
    pagination?: { page?: number; perPage?: number },
    dates?: { start_date?: string; end_date?: string },
  ): Promise<UserListResponse | AffiliateListResponse> => {
    switch (trxType) {
      case "affiliates":
        return browserApi.get<AffiliateListResponse>(adminUsersRoutes.AFFILIATES_LOG);
      case "users":
      default:
        return browserApi.get<UserListResponse>(adminUsersRoutes.LIST, {
          params: {
            ...(pagination?.page ? { page: pagination.page, per_page: pagination.perPage } : {}),
            ...dates,
          },
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
  getAccountInfo: (id: string | number, infoType: string, params?: AccountInfoParams) => {
    switch (infoType) {
      case "tribes":
        return browserApi.get<AccountInfoResponse>(buildPath(adminUsersRoutes.TRIBES, { id }));
      case "events":
        return browserApi.get<AccountInfoResponse>(buildPath(adminUsersRoutes.EVENTS, { id }), {
          params: { filter: params?.filter },
        });
      case "wallet":
        return browserApi.get<AccountInfoResponse>(buildPath(adminUsersRoutes.WALLET, { id }));
      case "activities-log":
      case "business":
      default:
        return browserApi.get<AccountInfoResponse>(buildPath(adminUsersRoutes.LOGS, { id }), {
          params,
        });
    }
  },

  getBusiness: (id: string | number) =>
    browserApi.get<UserBusinessResponse>(buildPath(adminUsersRoutes.BUSINESS, { id })),

  getUserTribe: (id: string | number, tribeId: string | number) =>
    browserApi.get<UserTribeDetailResponse>(
      buildPath(adminUsersRoutes.TRIBE, { id, tribe_id: tribeId }),
    ),

  getAccountPlan: (id: string | number) =>
    browserApi.get<AccountPlanResponse>(buildPath(adminUsersRoutes.ACCOUNT_PLAN, { id })),

  changePlan: (id: string | number, payload: { subscription_id: string; type?: string }) =>
    browserApi.patch<unknown>(buildPath(adminUsersRoutes.CHANGE_PLAN, { id }), payload),

  cancelPlan: (id: string | number) =>
    browserApi.patch<unknown>(buildPath(adminUsersRoutes.CANCEL_PLAN, { id }), {}),

  getPayoutHistory: (id: string | number) =>
    browserApi.get<PayoutHistoryResponse>(buildPath(adminUsersRoutes.PAYOUT_HISTORY, { id })),

  getAffiliateHistory: (affiliateId: string | number) =>
    browserApi.get<AffiliateHistoryResponse>(
      buildPath(adminUsersRoutes.AFFILIATES_AFFILIATE_HISTORY, { id: affiliateId }),
    ),

  getSupportMessages: (id: string | number) =>
    browserApi.get<SupportMessagesResponse>(buildPath(adminUsersRoutes.SUPPORT_CHAT, { id })),

  sendSupportMessage: (id: string | number, payload: SupportMessagePayload) =>
    browserApi.post<{ new_message: SupportMessage }>(
      buildPath(adminUsersRoutes.SUPPORT_CHAT_SEND, { id }),
      payload,
    ),

  // Uploads a picture or short video for the chat and returns its address.
  uploadChatMedia: async (file: File): Promise<SupportMedia> => {
    const formData = new FormData();
    formData.append("file", file);
    const uploaded = await browserApi.post<{ image: string }>(
      adminUtilitiesRoutes.UPLOAD,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return { type: file.type.startsWith("video/") ? "video" : "image", url: uploaded.image };
  },

  getReferralHistory: (affiliateId: string | number) =>
    browserApi.get<ReferralHistoryResponse>(
      buildPath(adminUsersRoutes.AFFILIATES_REFERRAL_HISTORY, { id: affiliateId }),
    ),

  getTribeHistory: (id: string | number) =>
    browserApi.get<UserTribeHistoryResponse>(buildPath(adminUsersRoutes.TRIBE_HISTORY, { id })),

  suspendUser: (id: string | number, reason: string) =>
    browserApi.patch<UserActionResponse>(buildPath(adminUsersRoutes.SUSPEND, { id }), { reason }),

  deactivateUser: (id: string | number, reason: string) =>
    browserApi.patch<UserActionResponse>(buildPath(adminUsersRoutes.DEACTIVATE, { id }), {
      reason,
    }),

  reactivateUser: (id: string | number) =>
    browserApi.patch<UserActionResponse>(buildPath(adminUsersRoutes.REACTIVATE, { id }), {}),
};
