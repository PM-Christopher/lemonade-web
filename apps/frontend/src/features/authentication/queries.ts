import { useQuery } from "@tanstack/react-query";
import { authApi } from "./api";

// Hierarchical key factory — see docs/ARCHITECTURE.md §11. Only one key
// exists today (currentUser); this is still a factory, not an inline
// array, so invalidation stays precise as the auth domain grows.
export const authKeys = {
    all: () => ["auth"] as const,
    currentUser: () => [...authKeys.all(), "currentUser"] as const,
};

/**
 * The single source of truth for "who is logged in, if anyone." Replaces
 * the dead `verifyUserToken` function that used to sit unused in
 * MainLayout.tsx — this one actually runs. A 401 here means there's no
 * valid session (the httpOnly cookie is absent, or refresh already failed
 * server-side inside the BFF proxy) — that's an expected, not-logged-in
 * state, not a transient failure worth retrying.
 */
export function useCurrentUserQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: authKeys.currentUser(),
        queryFn: authApi.getCurrentUser,
        staleTime: 60_000,
        retry: false,
        enabled: options?.enabled,
    });
}
