import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi, type NotificationsResponse } from "./api";
import { notificationKeys } from "./queries";

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: (result) => {
      // Flip the row locally so the badge drops at once; the refetch confirms it.
      queryClient.setQueryData<NotificationsResponse>(notificationKeys.list(), (old) =>
        old
          ? {
              ...old,
              notifications: old.notifications.map((notification) =>
                notification.id === result.id
                  ? { ...notification, read_at: result.read_at }
                  : notification,
              ),
            }
          : old,
      );
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      const readAt = new Date().toISOString();
      queryClient.setQueryData<NotificationsResponse>(notificationKeys.list(), (old) =>
        old
          ? {
              ...old,
              notifications: old.notifications.map((notification) => ({
                ...notification,
                read_at: notification.read_at ?? readAt,
              })),
            }
          : old,
      );
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
}
