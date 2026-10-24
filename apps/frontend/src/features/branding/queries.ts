import { useQuery } from "@tanstack/react-query";
import { brandingApi } from "./api";

export const brandingKeys = {
  all: () => ["branding"] as const,
};

// Logo and name set in the admin console. Reference data.
export function useBrandingQuery() {
  return useQuery({
    queryKey: brandingKeys.all(),
    queryFn: brandingApi.get,
    staleTime: 60 * 60_000,
  });
}
