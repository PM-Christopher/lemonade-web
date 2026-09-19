import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminTeamMembersRoutes, buildPath } from "@lemonade/api-types/generated";
import type { TeamListResponse, TeamDetailResponse } from "./api";

export const teamServerApi = {
  getTeamData: () => backendApi.get<TeamListResponse>(adminTeamMembersRoutes.LIST),

  getTeamDetail: (id: number | string) =>
    backendApi.get<TeamDetailResponse>(buildPath(adminTeamMembersRoutes.SHOW, { id })),
};
