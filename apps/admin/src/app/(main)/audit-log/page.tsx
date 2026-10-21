import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import AuditLogClient from "./AuditLogClient";

export default async function AuditLogPage() {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.teamMembers);

  return <AuditLogClient />;
}
