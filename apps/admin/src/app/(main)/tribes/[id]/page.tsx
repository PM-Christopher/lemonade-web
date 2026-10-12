import type { Metadata } from "next";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import TribeDetailClient from "./TribeDetailClient";

export const metadata: Metadata = { title: "Tribe details" };

export default async function TribeDetailPage(props: { params: Promise<{ id: string }> }) {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.tribes);

  const { id } = await props.params;
  return <TribeDetailClient id={id} />;
}
