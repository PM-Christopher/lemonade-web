import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import SupportInboxClient from "./SupportInboxClient";

export default async function SupportInboxPage() {
  await requireAdminPermission(ADMIN_PERMISSIONS.supportView);

  return <SupportInboxClient />;
}
