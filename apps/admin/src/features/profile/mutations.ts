import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi, type ChangePasswordPayload } from "./api";
import { profileKeys } from "./queries";

export function useChangeOwnPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => profileApi.changePassword(payload),
  });
}

export function useChangeProfileImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileApi.changeImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    },
  });
}
