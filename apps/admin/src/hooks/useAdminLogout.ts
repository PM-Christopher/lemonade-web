"use client";
import { useNavigation } from "@/hooks/useNavigation";
import { useQueryClient } from "@tanstack/react-query";
import { settingsKeys } from "@/features/settings/queries";
import { useLogoutMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useAppDispatch } from "@/redux/hook";
import { apiMessage } from "@/lib/api-message";
import { routes } from "@/lib/routes";

// Signs the admin out and returns to the login page.
export function useAdminLogout() {
  const dispatch = useAppDispatch();
  const { push } = useNavigation();
  const queryClient = useQueryClient();
  const logoutMutation = useLogoutMutation();

  return () =>
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({ show: true, message: apiMessage("Logged out"), type: "success" }),
        );
      },
      // The session is cleared locally even if the backend call fails.
      onSettled: () => {
        // Menu preferences belong to the admin who just left.
        queryClient.removeQueries({ queryKey: settingsKeys.detail() });
        push(routes.LOGIN);
      },
    });
}
