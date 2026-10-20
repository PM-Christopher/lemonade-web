import { useMutation } from "@tanstack/react-query";
import { profileApi, type ChangePasswordPayload } from "./api";

export function useChangeOwnPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => profileApi.changePassword(payload),
  });
}
