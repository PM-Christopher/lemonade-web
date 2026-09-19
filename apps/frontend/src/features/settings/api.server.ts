// Server-side twin of api.ts's client endpoints — for prefetching in a
// Server Component (see app/(main)/settings/wallet/page.tsx). Same
// convention as features/events/api.server.ts.
import "server-only";
import { backendApi } from "@/lib/server-api";
import { userProfileRoutes } from "@lemonade/api-types/generated";
import type { WalletSettings } from "./api";

export const settingsServerApi = {
  getWallet: () => backendApi.get<WalletSettings>(userProfileRoutes.WALLET_SHOW),
};
