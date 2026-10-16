import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authApi,
  type ChangePasswordPayload,
  type CurrentUser,
  type SessionUser,
  type ChangePlanPayload,
  type DeleteAccountPayload,
  type GoogleAuthPayload,
  type ForgotPasswordPayload,
  type LoginPayload,
  type NotificationSettingsPayload,
  type RegisterDeviceTokenPayload,
  type ResetPasswordPayload,
  type VerifyOtpPayload,
} from "./api";
import type { SocialsRequest } from "@lemonade/api-types/generated";
import { authKeys } from "./queries";
import { useAppDispatch } from "@/redux/hook";
import { authSuccess, resetAuth, updateUser } from "./authSlice";

// Non-secret stand-in for `authToken`; the real token only lives in the httpOnly cookie.
const SESSION_MARKER = "session";

/** Syncs a freshly started BFF session into Redux and the current-user cache. */
function useStartSession() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return (user: CurrentUser) => {
    dispatch(authSuccess({ user, token: SESSION_MARKER }));
    queryClient.setQueryData(authKeys.currentUser(), user);
  };
}

/** Password login. Mid-onboarding results are left to the caller, which stores the onboarding token. */
export function useLoginMutation() {
  const startSession = useStartSession();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (result) => {
      if (!result.needsOnboarding) startSession(result.user);
    },
  });
}

/** Google sign-in, same contract as useLoginMutation. */
export function useGoogleAuthMutation() {
  const startSession = useStartSession();

  return useMutation({
    mutationFn: (payload: GoogleAuthPayload) => authApi.googleAuth(payload),
    onSuccess: (result) => {
      if (!result.needsOnboarding) startSession(result.user);
    },
  });
}

/** Last onboarding step; the BFF swaps the onboarding token for a full session. */
export function useCompleteOnboardingMutation() {
  const startSession = useStartSession();

  return useMutation({
    mutationFn: (data: SocialsRequest) => authApi.completeOnboarding(data),
    onSuccess: (result) => startSession(result.user),
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

function syncUser(
  dispatch: ReturnType<typeof useAppDispatch>,
  queryClient: ReturnType<typeof useQueryClient>,
  user: Partial<SessionUser>,
) {
  dispatch(updateUser(user));
  queryClient.setQueryData(authKeys.currentUser(), (old: unknown) => ({
    ...(old as object),
    ...(user as object),
  }));
}

export function useUpdateProfileFieldMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ url, data }: { url: string; data: unknown }) =>
      authApi.updateProfileField(url, data),
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NotificationSettingsPayload) => authApi.updateNotificationSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authKeys.notificationSettings(),
      });
    },
  });
}

// No query to invalidate — this just hands the browser's FCM token to the
// backend, fire-and-forget from FcmContext.tsx's point of view.
export function useRegisterDeviceTokenMutation() {
  return useMutation({
    mutationFn: (data: RegisterDeviceTokenPayload) => authApi.registerDeviceToken(data),
  });
}

export function useChangePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangePlanPayload) => authApi.changePlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.subscription() });
    },
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
