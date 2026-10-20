import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import ServiceDetailsClient from "./ServiceDetailsClient";

export default async function ServiceDetailsPage(props: { params: Promise<{ id: string }> }) {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.businesses);

  const { id } = await props.params;

  return <ServiceDetailsClient id={id} />;
}
