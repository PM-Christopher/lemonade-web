// Endpoint layer for the team domain — see features/dashboard/api.ts for
// the pattern this follows: the BFF proxy transport (browserApi), not the
// pre-BFF axiosInstance.
import { browserApi } from "@/lib/browser-api";
import { adminTeamMembersRoutes, buildPath } from "@lemonade/api-types/generated";

export interface TeamMember {
  id: number;
  unique_id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  created_at: string;
  status: string;
}

export interface TeamListResponse {
  admins: TeamMember[];
}

export interface TeamDetailResponse {
  team: TeamMember;
}

export interface CreateTeamMemberPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface CreateTeamMemberResponse {
  admin: TeamMember;
}

export const teamApi = {
  getTeamData: () => browserApi.get<TeamListResponse>(adminTeamMembersRoutes.LIST),

  getTeamDetail: (id: number) =>
    browserApi.get<TeamDetailResponse>(buildPath(adminTeamMembersRoutes.SHOW, { id })),

  // No trailing slash — adminTeamMembersRoutes.CREATE already has none, and
  // one here made the proxy 308-redirect every create (harmless since POST
  // redirects preserve method+body, but an avoidable extra round trip).
  addTeamMember: (payload: CreateTeamMemberPayload) =>
    browserApi.post<CreateTeamMemberResponse>(adminTeamMembersRoutes.CREATE, payload),
};
