import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "./api";

export const settingsKeys = {
  all: () => ["settings"] as const,
  profile: () => [...settingsKeys.all(), "profile"] as const,
  wallet: () => [...settingsKeys.all(), "wallet"] as const,
  bankAccount: () => [...settingsKeys.all(), "bank-account"] as const,
  referral: () => [...settingsKeys.all(), "referral"] as const,
  referralActivity: () => [...settingsKeys.all(), "referral-activity"] as const,
  rewardsHistory: () => [...settingsKeys.all(), "rewards-history"] as const,
  support: () => [...settingsKeys.all(), "support"] as const,
  tribeHistory: () => [...settingsKeys.all(), "tribe-history"] as const,
};

// User-owned content — CLAUDE.md's 60s bucket.
export function useUserProfileQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: settingsKeys.profile(),
    queryFn: settingsApi.getUserProfile,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

// Wallet balance + payout status — CLAUDE.md's money bucket, staleTime 0.
export function useWalletSettingsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: settingsKeys.wallet(),
    queryFn: settingsApi.getWallet,
    staleTime: 0,
    enabled: options?.enabled,
  });
}

// The saved payout bank account, or null when there isn't one.
export function useBankAccountQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: settingsKeys.bankAccount(),
    queryFn: settingsApi.getBankAccount,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

// Referral code/link + the real configured commission rate — user-owned content, 60s bucket.
export function useReferralSummaryQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: settingsKeys.referral(),
    queryFn: settingsApi.getReferralSummary,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

// Referral earnings/counts — user-owned content, 60s bucket.
export function useReferralActivityQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: settingsKeys.referralActivity(),
    queryFn: settingsApi.getReferralActivity,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}

// Itemized reward history (every referral/affiliate credit) — money-adjacent, staleTime 0.
export function useRewardsHistoryQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: settingsKeys.rewardsHistory(),
    queryFn: settingsApi.getRewardsHistory,
    staleTime: 0,
    enabled: options?.enabled,
  });
}

// What paid members have added to the owner's earnings — money-adjacent, staleTime 0.
export function useTribeHistoryQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: settingsKeys.tribeHistory(),
    queryFn: settingsApi.getTribeHistory,
    staleTime: 0,
    enabled: options?.enabled,
  });
}

// Replies from the support team arrive while the page is open, so it polls.
export function useSupportMessagesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: settingsKeys.support(),
    queryFn: settingsApi.getSupportMessages,
    staleTime: 0,
    refetchInterval: 10_000,
    enabled: options?.enabled,
  });
}
