import { useQuery } from "@tanstack/react-query";
import { rolesApi } from "./api";

export const roleKeys = {
  all: () => ["roles"] as const,
  list: () => [...roleKeys.all(), "list"] as const,
  permissions: () => [...roleKeys.all(), "permissions"] as const,
  assignable: () => [...roleKeys.all(), "assignable"] as const,
};

export function useRolesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: rolesApi.list,
    staleTime: 30_000,
    enabled: options?.enabled,
  });
}

// The permission catalog only changes with a release.
export function usePermissionCatalogQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: roleKeys.permissions(),
    queryFn: rolesApi.permissions,
    staleTime: 60 * 60_000,
    enabled: options?.enabled,
  });
}

export function useAssignableRolesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: roleKeys.assignable(),
    queryFn: rolesApi.assignable,
    staleTime: 30_000,
    enabled: options?.enabled,
  });
}
