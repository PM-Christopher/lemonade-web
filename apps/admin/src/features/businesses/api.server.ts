import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminBusinessesRoutes, buildPath } from "@lemonade/api-types/generated";
import type { BusinessFilters, BusinessListResponse, BusinessDetailResponse } from "./api";

export const businessesServerApi = {
  getBusinesses: (filters?: BusinessFilters) =>
    backendApi.get<BusinessListResponse>(adminBusinessesRoutes.LIST, { params: filters }),

  getBusinessDetail: (id: string) =>
    backendApi.get<BusinessDetailResponse>(buildPath(adminBusinessesRoutes.SHOW, { id })),
};
