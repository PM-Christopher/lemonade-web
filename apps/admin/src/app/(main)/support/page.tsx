import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import SupportInboxClient from "./SupportInboxClient";

export default async function SupportInboxPage() {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.users);

  return <SupportInboxClient />;
}
