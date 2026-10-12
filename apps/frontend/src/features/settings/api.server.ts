// Server-side twin of api.ts, used to prefetch in Server Components.
import "server-only";
import { backendApi } from "@/lib/server-api";
import { userProfileRoutes } from "@lemonade/api-types/generated";
import type { ReferralActivity, ReferralSummary, WalletSettings } from "./api";

export const settingsServerApi = {
  getWallet: () => backendApi.get<WalletSettings>(userProfileRoutes.WALLET_SHOW),
  getReferralSummary: () => backendApi.get<ReferralSummary>(userProfileRoutes.REFERRAL_SHOW),
  getReferralActivity: () => backendApi.get<ReferralActivity>(userProfileRoutes.REFERRAL_ACTIVITY),
};
