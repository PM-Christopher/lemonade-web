import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import AuditLogClient from "./AuditLogClient";

export default async function AuditLogPage() {
  await requireAdminPermission(ADMIN_PERMISSIONS.auditView);

  return <AuditLogClient />;
}
