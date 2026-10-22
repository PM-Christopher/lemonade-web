// Endpoints for the admin notification bell over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminNotificationsRoutes, buildPath } from "@lemonade/api-types/generated";

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  // `link` is the admin page the notification is about.
  meta: { link?: string };
  read: boolean;
  created_at: string;
}

export interface AdminNotificationsResponse {
  notifications: AdminNotification[];
  unread_count: number;
  // People waiting on a support answer.
  support_unread: number;
}

export const notificationsApi = {
  getNotifications: () => browserApi.get<AdminNotificationsResponse>(adminNotificationsRoutes.LIST),

  markRead: (id: string) =>
    browserApi.post<{ unread_count: number }>(buildPath(adminNotificationsRoutes.READ, { id }), {}),

  markAllRead: () =>
    browserApi.post<{ unread_count: number }>(adminNotificationsRoutes.READ_ALL, {}),
};
