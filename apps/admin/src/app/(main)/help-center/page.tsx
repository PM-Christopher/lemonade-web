import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import HelpCenterClient from "./HelpCenterClient";

export default async function HelpCenterPage() {
  await requireAdminPermission(ADMIN_PERMISSIONS.faqsManage);

  return <HelpCenterClient />;
}
