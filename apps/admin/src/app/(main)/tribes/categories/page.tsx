import type { Metadata } from "next";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import { CategoriesManager } from "@/components/categories/CategoriesManager";

export const metadata: Metadata = { title: "Categories" };

export default async function TribesCategoriesPage() {
  await requireAdminPermission(ADMIN_PERMISSIONS.categoriesManage);

  return <CategoriesManager type="tribes" />;
}
