import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminTeamRoutes } from "@lemonade/api-types";
import type { TeamListResponse, TeamDetailResponse } from "./api";

export const teamServerApi = {
  getTeamData: () => backendApi.get<TeamListResponse>(adminTeamRoutes.BASE),

  getTeamDetail: (id: number | string) =>
    backendApi.get<TeamDetailResponse>(`${adminTeamRoutes.BASE}/${id}`),
};
