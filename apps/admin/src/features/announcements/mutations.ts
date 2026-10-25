import { useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementsApi, type AnnouncementPayload } from "./api";
import { announcementKeys } from "./queries";

// Create and edit both refresh the list and the open detail page.
export function useSaveAnnouncementMutation(id?: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AnnouncementPayload) =>
      id === undefined
        ? announcementsApi.createAnnouncement(payload)
        : announcementsApi.updateAnnouncement(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.list() });
      if (id !== undefined) {
        queryClient.invalidateQueries({ queryKey: announcementKeys.detail(id) });
      }
    },
  });
}
