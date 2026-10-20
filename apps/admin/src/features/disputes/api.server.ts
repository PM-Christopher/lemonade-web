import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminBusinessesRoutes, buildPath } from "@lemonade/api-types/generated";
import type { DisputeDetailResponse, DisputeListResponse } from "./api";

export const disputesServerApi = {
  getDisputes: (status?: string) =>
    backendApi.get<DisputeListResponse>(adminBusinessesRoutes.DISPUTES_LIST, {
      params: status ? { status } : undefined,
    }),

  getDispute: (id: string) =>
    backendApi.get<DisputeDetailResponse>(buildPath(adminBusinessesRoutes.DISPUTES_SHOW, { id })),
};
