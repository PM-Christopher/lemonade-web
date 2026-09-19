// Server-side twin of api.ts's client endpoints — for prefetching in a
// Server Component. Same pattern as features/events/api.server.ts: only
// the endpoints actually prefetched, using backendApi (direct-to-backend)
// instead of browserApi (BFF-proxy, client-only).
import "server-only";
import { backendApi } from "@/lib/server-api";
import { sharedUtilitiesRoutes } from "@lemonade/api-types/generated";
import type { BusinessCategoriesResponse } from "./api";

export const sharedServerApi = {
  getBusinessCategories: () =>
    backendApi.get<BusinessCategoriesResponse>(
      sharedUtilitiesRoutes.BUSINESS_CATEGORIES,
    ),
};
