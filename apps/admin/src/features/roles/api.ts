// Endpoints for roles and permissions over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminRolesRoutes, adminTeamMembersRoutes, buildPath } from "@lemonade/api-types/generated";

export interface AdminRole {
  id: number | string;
  // Lowercase slug, e.g. "customer-support".
  name: string;
  label: string;
  is_super_admin: boolean;
  permissions: string[];
  permission_count: number;
  admin_count: number;
  created_at: string | null;
}

export interface PermissionGroup {
  group: string;
  permissions: Array<{ name: string; label: string }>;
}

export interface RolePayload {
  name: string;
  permissions: string[];
}

export const rolesApi = {
  list: () => browserApi.get<{ roles: AdminRole[] }>(adminRolesRoutes.LIST),

  permissions: () => browserApi.get<{ groups: PermissionGroup[] }>(adminRolesRoutes.PERMISSIONS),

  // The roles a new team member can be given (leaves out the super admin).
  assignable: () => browserApi.get<{ roles: AdminRole[] }>(adminTeamMembersRoutes.ROLES),

  create: (payload: RolePayload) =>
    browserApi.post<{ role: AdminRole }>(adminRolesRoutes.STORE, payload),

  update: (id: number | string, payload: RolePayload) =>
    browserApi.patch<{ role: AdminRole }>(buildPath(adminRolesRoutes.UPDATE, { id }), payload),

  // Admins on the role move to `reassignTo` before it is deleted.
  remove: (id: number | string, reassignTo?: number | string) =>
    browserApi.delete<{ deleted: boolean; reassigned: number }>(
      buildPath(adminRolesRoutes.DESTROY, { id }),
      { params: reassignTo === undefined ? undefined : { reassign_to: reassignTo } },
    ),
};
