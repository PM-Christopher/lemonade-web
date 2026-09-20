"use client";

import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { useCurrentAdminQuery } from "@/features/authentication/queries";

interface RequirePermissionProps {
  permission: string;
  children: ReactNode;
}

/**
 * Section-level gate: an admin whose role lacks this permission gets a real
 * 404 for the whole page, not just hidden buttons within it — the section
 * isn't meant to be discoverable via direct URL either. See
 * docs/ARCHITECTURE.md §22 Conflict 2.
 *
 * This is UX only. The backend's `can:<section>.write` middleware is the
 * real authority regardless — this component exists so a restricted admin
 * doesn't land on a page full of controls that will all 403.
 */
export function RequirePermission({ permission, children }: RequirePermissionProps) {
  const { data, isLoading } = useCurrentAdminQuery();

  if (isLoading) {
    return null;
  }

  if (!data?.permissions?.includes(permission)) {
    notFound();
  }

  return <>{children}</>;
}
