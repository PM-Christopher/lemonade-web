import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, type LoginPayload, type RegisterDeviceTokenPayload } from "./api";
import { authKeys } from "./queries";
import { useAppDispatch } from "@/redux/hook";
import { authSuccess, resetAuth } from "./authSlice";

// Non-secret placeholder — see the frontend app's equivalent mutations.ts
// for the full rationale. The real access token lives only in the
// httpOnly cookie set server-side by app/api/auth/login/route.ts.
const SESSION_MARKER = "session";

/**
 * Handles only the fully-onboarded login path. A response with
 * `needsOnboarding: true` (admin.status === 0) is NOT synced into
 * Redux/the query cache here — the caller (the login page) still owns
 * that redirect + its own short-lived `newToken` cookie, unchanged from
 * before this cutover.
 */
export function useLoginMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (result) => {
      if (result.needsOnboarding) return;
      dispatch(authSuccess({ admin: result.admin, token: SESSION_MARKER }));
      queryClient.setQueryData(authKeys.currentAdmin(), result.admin);
    },
  });
}

export function useLogoutMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      dispatch(resetAuth());
      queryClient.removeQueries({ queryKey: authKeys.all() });
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
