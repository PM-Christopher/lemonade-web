// Server-side twin of api.ts, used to prefetch in Server Components.
import "server-only";
import { backendApi, onboardingAuth } from "@/lib/server-api";
import { userProfileRoutes } from "@lemonade/api-types/generated";
import type { ReferralActivity, ReferralSummary, UserProfile, WalletSettings } from "./api";

export const settingsServerApi = {
  // Also works mid-signup, on the onboarding cookie.
  getUserProfile: async () =>
    backendApi.get<UserProfile>(userProfileRoutes.SHOW, await onboardingAuth()),
  getWallet: () => backendApi.get<WalletSettings>(userProfileRoutes.WALLET_SHOW),
  getReferralSummary: () => backendApi.get<ReferralSummary>(userProfileRoutes.REFERRAL_SHOW),
  getReferralActivity: () => backendApi.get<ReferralActivity>(userProfileRoutes.REFERRAL_ACTIVITY),
};
