// Server-side twin of api.ts's client endpoints — for prefetching in a
// Server Component (see app/(main)/business/[id]/page.tsx). Same
// convention as features/events/api.server.ts.
import "server-only";
import { backendApi } from "@/lib/server-api";
import { userBusinessRoutes } from "@lemonade/api-types";
import type { BusinessDetailResponse } from "./api";

export const businessServerApi = {
  getBusiness: (id: number | string) =>
    backendApi.get<BusinessDetailResponse>(`${userBusinessRoutes.BASE}/${id}`),
};
