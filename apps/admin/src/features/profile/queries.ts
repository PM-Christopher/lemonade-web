import { useQuery } from "@tanstack/react-query";
import { profileApi } from "./api";

export const profileKeys = {
    all: () => ["profile"] as const,
    me: () => [...profileKeys.all(), "me"] as const,
};

/** "profile" is explicitly named in the "user-owned content" staleness bucket (60s). */
export function useAdminProfileQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: profileKeys.me(),
        queryFn: profileApi.getProfile,
        staleTime: 60_000,
        enabled: options?.enabled,
    });
}
