import { useQuery } from "@tanstack/react-query";
import { authApi } from "./api";

export const authKeys = {
    all: () => ["auth"] as const,
    currentAdmin: () => [...authKeys.all(), "currentAdmin"] as const,
};

/**
 * The single source of truth for "who is logged in, if anyone." Admin had
 * no equivalent check before this — session state was purely whatever
 * redux-persist had cached, never revalidated against the backend. A 401
 * here means there's no valid session (httpOnly cookie absent, or admin
 * has no refresh route so an expired token can't be silently renewed) —
 * that's an expected, not-logged-in state, not worth retrying.
 */
export function useCurrentAdminQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: authKeys.currentAdmin(),
        queryFn: authApi.getCurrentAdmin,
        staleTime: 30_000,
        retry: false,
        enabled: options?.enabled,
    });
}
