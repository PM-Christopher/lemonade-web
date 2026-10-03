// Endpoint layer for the settings/profile domain — see features/dashboard/api.ts
// for the pattern this follows: the BFF proxy transport (browserApi), not
// the pre-BFF axiosInstance.
//
// NOTE: this only covers what profile.slice.ts + the direct settingsApi
// consumers actually use today (profile read, wallet read, request payout,
// create bank account). ProfileController owns ~30 more routes (notification
// settings, subscription/billing, account deletion, individual profile-field
// edits) — several of those (notification-settings, subscription,
// billing-history) were migrated in Phase 6, but into
// features/authentication instead of here, since their existing mutations
// (updateNotificationSettings, changePlan) already live there and
// eslint-plugin-boundaries doesn't allow one feature's mutations to
// invalidate another feature's query keys. What's left (account deletion,
// individual profile-field edits) is still on the legacy useRequest hook or
// untouched — tracked as its own follow-up.
import { browserApi } from "@/lib/browser-api";
import { userProfileRoutes, userWalletRoutes } from "@lemonade/api-types/generated";

export interface UserProfile {
  id: number;
  referred_by: string | null;
  lemon_id: string;
  fullname: string;
  email: string;
  username: string;
  bio: string | null;
  industry: string | null;
  profile_image: string | null;
  status: string;
  verified: boolean;
  skills: string[] | null;
  address: {
    address: string;
    city: string;
    state: string;
    country: string;
  } | null;
  interests: string[] | null;
  socials: Array<{ name: string; value: string }> | null;
  referral_code: string;
  subscriptions: {
    title: string;
    benefits: {
      verification_badge: boolean;
      tribe_creation: boolean;
      lemon_id: boolean;
      event_creation: boolean;
      ticket_sales_commission: number;
      service_commission: number;
      connection_range: number;
      offline_benefits: boolean;
    };
  } | null;
}

export interface PayoutHistoryItem {
  amount_minor: number;
  amount: string;
  status: string;
  date: string;
}

export interface WalletSettings {
  total_amount_earned_minor: number;
  total_amount_earned: string;
  // Lifetime total from every reward source (referrals and event-affiliate links alike) —
  // reward money is swept into the spendable wallet the moment it's earned, so this is a
  // running history total, not a separate spendable balance.
  rewards_earned_minor: number;
  rewards_earned: string;
  monetized_tribes_minor: number;
  monetized_tribes: string;
  payout_history: PayoutHistoryItem[];
  withdrawal_threshold_minor: number;
  withdrawal_threshold: string;
  payout_request: boolean;
}

export interface RewardsHistoryItem {
  amount_minor: number;
  amount: string;
  created_at: string;
}

export interface RewardsHistoryResponse {
  affiliate_history: RewardsHistoryItem[];
}

export interface RequestPayoutPayload {
  amount?: number;
  bank_account_id?: string;
}

export interface RequestPayoutResponse {
  message: string;
  withdrawal_request_id: string;
  amount_minor: number;
}

export interface CreateBankAccountPayload {
  bank_name: string;
  account_name: string;
  account_number: string;
  bank_code?: string;
}

export interface BankAccount {
  id: string;
  user_id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string | null;
}

export interface CreateBankAccountResponse {
  bank_account: BankAccount;
}

export interface ReferralSummary {
  referral_code: string;
  // Relative path only (e.g. "signup?referral=CODE") — build the full shareable URL with
  // NEXT_PUBLIC_APP_URL, the same pattern used for event affiliate links.
  referral_path: string;
  commission_percent: number;
}

export interface ReferralActivity {
  total_amount_earned_minor: number;
  total_amount_earned: string;
  total_referrals: number;
  total_subscribed_referrals: number;
}

export const settingsApi = {
  getUserProfile: () => browserApi.get<UserProfile>(userProfileRoutes.SHOW),

  getWallet: () => browserApi.get<WalletSettings>(userProfileRoutes.WALLET_SHOW),

  requestPayout: (data: RequestPayoutPayload) =>
    browserApi.post<RequestPayoutResponse>(userProfileRoutes.WALLET_REQUEST_PAYOUT, data),

  createBankAccount: (data: CreateBankAccountPayload) =>
    browserApi.post<CreateBankAccountResponse>(userProfileRoutes.BANK_ACCOUNT_CREATE, data),

  getReferralSummary: () => browserApi.get<ReferralSummary>(userProfileRoutes.REFERRAL_SHOW),

  getReferralActivity: () => browserApi.get<ReferralActivity>(userProfileRoutes.REFERRAL_ACTIVITY),

  getRewardsHistory: () =>
    browserApi.get<RewardsHistoryResponse>(userWalletRoutes.AFFILIATE_HISTORY),
};
