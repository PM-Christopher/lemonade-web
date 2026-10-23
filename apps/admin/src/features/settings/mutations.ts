import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi, type MenuPreferences, type PlatformSettingsPayload } from "./api";
import { settingsKeys } from "./queries";

export function useUpdatePlatformSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlatformSettingsPayload) => settingsApi.updatePlatform(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.all() }),
  });
}

export function useUpdateMenuPreferencesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MenuPreferences) => settingsApi.updatePreferences(payload),
    onSuccess: (settings) => {
      queryClient.setQueryData(settingsKeys.detail(), settings);
    },
  });
}

export function useUploadLogoMutation() {
  return useMutation({ mutationFn: (file: File) => settingsApi.uploadLogo(file) });
}
