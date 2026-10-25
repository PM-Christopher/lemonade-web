import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminPermission } from "@/features/authentication/requirePermission.server";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import { CATEGORY_TYPES, type CategoryType } from "@/features/categories/api";
import { CategoriesManager } from "@/components/categories/CategoriesManager";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage({ params }: { params: Promise<{ type: string }> }) {
  await requireAdminPermission(ADMIN_PERMISSIONS.categoriesManage);

  const { type } = await params;
  if (!CATEGORY_TYPES.includes(type as CategoryType)) notFound();

  return <CategoriesManager type={type as CategoryType} />;
}
