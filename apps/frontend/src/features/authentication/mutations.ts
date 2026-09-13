import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, type LoginPayload } from "./api";
import { authKeys } from "./queries";
import { useAppDispatch } from "@/redux/hook";
import { authSuccess, resetAuth } from "./authSlice";

// Non-secret placeholder — the real access token lives only in the
// httpOnly cookie set server-side by app/api/auth/login/route.ts and is
// never readable here. This exists purely so the ~70 existing components
// that check `!!state.auth.authToken` as an "am I logged in" signal keep
// working without auditing every one of them in this pass; it carries no
// credential value, is never sent in a request, and replacing those reads
// with `isLoggedIn`/`user` is tracked as separate follow-up work.
const SESSION_MARKER = "session";

/**
 * Handles only the fully-onboarded login path. A response with
 * `needsOnboarding: true` (new signup pending email verification, or an
 * existing account with no username yet) is NOT synced into Redux/the
 * query cache here — the caller (the login page) still owns that
 * redirect + its own short-lived `newToken` cookie, unchanged from
 * before this cutover. See app/api/auth/login/route.ts for why.
 */
export function useLoginMutation() {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: LoginPayload) => authApi.login(payload),
        onSuccess: (result) => {
            if (result.needsOnboarding) return;
            dispatch(authSuccess({ user: result.user, token: SESSION_MARKER }));
            queryClient.setQueryData(authKeys.currentUser(), result.user);
        },
    });
}

export function useLogoutMutation() {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSettled: () => {
            // Clear client state even if the backend call failed (already
            // logged out, network blip) — see app/api/auth/logout/route.ts,
            // which clears the cookie unconditionally on its side too.
            dispatch(resetAuth());
            queryClient.removeQueries({ queryKey: authKeys.all() });
        },
    });
}
