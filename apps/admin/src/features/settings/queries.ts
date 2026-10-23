import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "./api";

export const settingsKeys = {
  all: () => ["settings"] as const,
  branding: () => [...settingsKeys.all(), "branding"] as const,
  detail: () => [...settingsKeys.all(), "detail"] as const,
};

// Logo and name, readable before sign-in. Reference data.
export function useBrandingQuery() {
  return useQuery({
    queryKey: settingsKeys.branding(),
    queryFn: settingsApi.branding,
    staleTime: 60 * 60_000,
  });
}

// Platform settings plus this admin's menu preferences.
export function useAdminSettingsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: settingsKeys.detail(),
    queryFn: settingsApi.get,
    staleTime: 60_000,
    enabled: options?.enabled,
  });
}
