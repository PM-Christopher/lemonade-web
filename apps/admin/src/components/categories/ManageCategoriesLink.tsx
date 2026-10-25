"use client";
import React from "react";
import Link from "next/link";
import { TagsIcon } from "lucide-react";
import { routes } from "@/lib/routes";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import { useHasPermission } from "@/features/authentication/queries";
import type { CategoryType } from "@/features/categories/api";

const CATEGORY_ROUTES: Record<CategoryType, string> = {
  tribes: routes.TRIBE_CATEGORIES,
  business: routes.BUSINESS_CATEGORIES,
  report: routes.REPORT_CATEGORIES,
};

// Leads from a feature page to its category list. Shown only to admins who can manage them.
export function ManageCategoriesLink({ type }: { type: CategoryType }) {
  const canManage = useHasPermission(ADMIN_PERMISSIONS.categoriesManage);
  if (!canManage) return null;

  return (
    <Link
      href={CATEGORY_ROUTES[type]}
      className="border-light-grey-50 text-body-s flex h-10 shrink-0 items-center gap-2 rounded-xl border bg-white px-4 font-medium"
    >
      <TagsIcon className="h-4 w-4" />
      Manage categories
    </Link>
  );
}
