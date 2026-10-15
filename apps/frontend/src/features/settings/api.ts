// Endpoints for the settings domain over the BFF transport (browserApi).
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
  // Current, unredeemed Points balance — a real separate balance, not spendable until
  // redeemed (see RedeemPointsPayload below). Not included in wallet_balance.
  points_balance: number;
  // Lifetime total from every reward source (referrals and event-affiliate links alike),
  // whether still held as Points or already redeemed — a running history total, not a balance.
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

export interface RedeemPointsPayload {
  // Omit to redeem every point currently available.
  points?: number;
  idempotency_key: string;
}

export interface RedeemPointsResponse {
  points_redeemed: number;
  amount_minor: number;
  amount: string;
  currency: string;
  points_balance: number;
}

export interface RequestPayoutPayload {
  amount?: number;
  bank_account_id?: string;
}

export interface RequestPayoutResponse {
  message: string;
  withdrawal_request_id: string;
  amount_minor: number;
  // Server-formatted major units, e.g. "150000.00".
  amount: string;
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

export interface BankAccountSummary {
  bank_account: Pick<BankAccount, "bank_name" | "account_name" | "account_number"> | null;
}

export interface ReferralSummary {
  referral_code: string;
  // Relative path, e.g. "signup?referral=CODE". Build the full link with appUrl().
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

  getBankAccount: () => browserApi.get<BankAccountSummary>(userProfileRoutes.BANK_ACCOUNT_SHOW),

  createBankAccount: (data: CreateBankAccountPayload) =>
    browserApi.post<CreateBankAccountResponse>(userProfileRoutes.BANK_ACCOUNT_CREATE, data),

  getReferralSummary: () => browserApi.get<ReferralSummary>(userProfileRoutes.REFERRAL_SHOW),

  getReferralActivity: () => browserApi.get<ReferralActivity>(userProfileRoutes.REFERRAL_ACTIVITY),

  getRewardsHistory: () =>
    browserApi.get<RewardsHistoryResponse>(userWalletRoutes.AFFILIATE_HISTORY),

  redeemPoints: (data: RedeemPointsPayload) =>
    browserApi.post<RedeemPointsResponse>(userWalletRoutes.REDEEM_POINTS, data),
};
