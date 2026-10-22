import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import RolesClient from "./RolesClient";

export default async function RolesPage() {
  await requireAdminPermission(ADMIN_PERMISSIONS.rolesView);

  return <RolesClient />;
}
