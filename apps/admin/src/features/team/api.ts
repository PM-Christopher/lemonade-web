// Endpoints for the team domain over the BFF transport (browserApi).
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

export interface ActivityLogItem {
  id: string;
  message: string;
  created_at: string;
}

export interface ActivityLogsResponse {
  logs: ActivityLogItem[];
  meta?: { current_page: number; last_page: number; per_page: number; total: number };
}

// Mirrors App\Http\Requests\Admin\ChangeAdminPasswordRequest.
export interface ChangePasswordPayload {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}

export const teamApi = {
  getTeamData: () => browserApi.get<TeamListResponse>(adminTeamMembersRoutes.LIST),

  getTeamDetail: (id: string | number) =>
    browserApi.get<TeamDetailResponse>(buildPath(adminTeamMembersRoutes.SHOW, { id })),

  getActivityLogs: (
    id: string | number,
    filters: { start_date?: string; end_date?: string; page?: number; per_page?: number },
  ) =>
    browserApi.get<ActivityLogsResponse>(buildPath(adminTeamMembersRoutes.ACTIVITY_LOGS, { id }), {
      params: filters,
    }),

  changePassword: (id: string | number, payload: ChangePasswordPayload) =>
    browserApi.patch<{ admin: TeamMember }>(
      buildPath(adminTeamMembersRoutes.CHANGE_PASSWORD, { id }),
      payload,
    ),

  removeMember: (id: string | number) =>
    browserApi.delete<{ removed: boolean }>(buildPath(adminTeamMembersRoutes.DELETE, { id })),

  // No trailing slash — adminTeamMembersRoutes.CREATE already has none, and
  // one here made the proxy 308-redirect every create (harmless since POST
  // redirects preserve method+body, but an avoidable extra round trip).
  addTeamMember: (payload: CreateTeamMemberPayload) =>
    browserApi.post<CreateTeamMemberResponse>(adminTeamMembersRoutes.CREATE, payload),
};
