// Server-side twin of api.ts's client endpoints — for prefetching in a
// Server Component (see app/(main)/business/[id]/page.tsx). Same
// convention as features/events/api.server.ts.
import "server-only";
import { backendApi } from "@/lib/server-api";
import { userBusinessRoutes, userListingRoutes, buildPath } from "@lemonade/api-types/generated";
import type {
  BusinessDetailResponse,
  BusinessListResponse,
  BoostPackagesResponse,
  JobsDataResponse,
} from "./api";

export const businessServerApi = {
  getBusiness: (id: number | string) =>
    backendApi.get<BusinessDetailResponse>(buildPath(userBusinessRoutes.SHOW, { id })),

  getBusinesses: () =>
    backendApi.get<BusinessListResponse>(userBusinessRoutes.LIST),

  getBoostPackages: () =>
    backendApi.get<BoostPackagesResponse>(userListingRoutes.BOOSTS),

  getBusinessJobData: (id: number | string) =>
    backendApi.get<JobsDataResponse>(
      buildPath(userListingRoutes.JOB_DATA, { id }),
    ),
};
