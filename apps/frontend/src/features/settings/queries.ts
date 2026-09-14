import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "./api";

export const settingsKeys = {
    all: () => ["settings"] as const,
    profile: () => [...settingsKeys.all(), "profile"] as const,
    wallet: () => [...settingsKeys.all(), "wallet"] as const,
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
