import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminBusinessesRoutes, buildPath } from "@lemonade/api-types/generated";
import type { BusinessListResponse, BusinessDetailResponse } from "./api";

export const businessesServerApi = {
  getBusinesses: (status?: string) =>
    backendApi.get<BusinessListResponse>(adminBusinessesRoutes.LIST, {
      params: status ? { status } : undefined,
    }),

  getBusinessDetail: (id: string) =>
    backendApi.get<BusinessDetailResponse>(buildPath(adminBusinessesRoutes.SHOW, { id })),
};
