import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    authApi,
    type ChangePasswordPayload,
    type ChangePlanPayload,
    type DeleteAccountPayload,
    type ForgotPasswordPayload,
    type LoginPayload,
    type NotificationSettingsPayload,
    type ResetPasswordPayload,
    type VerifyOtpPayload,
} from "./api";
import { authKeys } from "./queries";
import { useAppDispatch } from "@/redux/hook";
import { authSuccess, resetAuth, updateUser } from "./authSlice";

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

// --- Pre-login onboarding (email verification / password reset) ---

export function useVerifyAccountOtpMutation() {
    return useMutation({
        mutationFn: (data: VerifyOtpPayload) => authApi.verifyAccountOtp(data),
    });
}

export function useVerifyPasswordResetOtpMutation() {
    return useMutation({
        mutationFn: (data: VerifyOtpPayload) => authApi.verifyPasswordResetOtp(data),
    });
}

export function useResendOtpMutation() {
    return useMutation({
        mutationFn: () => authApi.resendOtp(),
    });
}

export function useForgotPasswordMutation() {
    return useMutation({
        mutationFn: (data: ForgotPasswordPayload) => authApi.forgotPassword(data),
    });
}

export function useResetPasswordMutation() {
    return useMutation({
        mutationFn: (data: ResetPasswordPayload) => authApi.resetPassword(data),
    });
}

// --- Profile settings ---

function syncUser(dispatch: ReturnType<typeof useAppDispatch>, queryClient: ReturnType<typeof useQueryClient>, user: unknown) {
    dispatch(updateUser(user));
    queryClient.setQueryData(authKeys.currentUser(), (old: unknown) => ({ ...(old as object), ...(user as object) }));
}

export function useUpdateProfileFieldMutation() {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ url, data }: { url: string; data: unknown }) => authApi.updateProfileField(url, data),
        onSuccess: (result) => syncUser(dispatch, queryClient, result.user),
    });
}

export function useChangePasswordMutation() {
    return useMutation({
        mutationFn: (data: ChangePasswordPayload) => authApi.changePassword(data),
    });
}

export function useChangeProfileImageMutation() {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { profile_image: string }) => authApi.changeProfileImage(data),
        onSuccess: (result) => syncUser(dispatch, queryClient, result.user),
    });
}

export function useDeleteAccountMutation() {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: DeleteAccountPayload) => authApi.deleteAccount(data),
        onSuccess: () => {
            dispatch(resetAuth());
            queryClient.removeQueries({ queryKey: authKeys.all() });
        },
    });
}

export function useUpdateNotificationSettingsMutation() {
    return useMutation({
        mutationFn: (data: NotificationSettingsPayload) => authApi.updateNotificationSettings(data),
    });
}

export function useChangePlanMutation() {
    return useMutation({
        mutationFn: (data: ChangePlanPayload) => authApi.changePlan(data),
    });
}

// A per-click lookup (PricingCard's "Subscribe" click) — not cacheable
// list/detail state, same pattern as tribes' useViewProfileMutation. Lives
// in the parent page (settings/plan/page.tsx), not PricingCard itself,
// since the fetched plan feeds a modal the parent renders once, not each card.
export function useSubscriptionPlanMutation() {
    return useMutation({
        mutationFn: (id: number | string) => authApi.getSubscriptionPlan(id),
    });
}
