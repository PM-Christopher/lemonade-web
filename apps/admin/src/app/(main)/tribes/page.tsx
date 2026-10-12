import type { Metadata } from "next";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_SECTION_PERMISSIONS } from "@/features/authentication/permissions";
import TribesClient from "./TribesClient";

export const metadata: Metadata = { title: "Tribes" };

export default async function TribesPage() {
  await requireAdminPermission(ADMIN_SECTION_PERMISSIONS.tribes);

  return <TribesClient />;
}
