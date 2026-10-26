// Endpoints for the signed-in user's notifications.
import { browserApi } from "@/lib/browser-api";
import { userNotificationRoutes, buildPath } from "@lemonade/api-types/generated";

export interface NotificationMeta {
  image?: string;
  tribe_name?: string;
  category?: string;
  description?: string;
  monetized?: boolean;
  private?: boolean;
  title?: string;
  content?: string;
  date_scheduled?: string;
  status?: string;
  message?: string;
  invite_message?: string;
  user_id?: string;
  business_id?: string;
  service_request_id?: string;
  job_id?: string;
  role?: "owner" | "client";
  from_username?: string;
  created_at?: string;
  event_image?: string;
  event_name?: string;
  start_date?: string;
  location?: string;
  event_description?: string;
  socials?: Array<{ name?: string; value?: string }>;
}

export interface AppNotification {
  id: string;
  title?: string;
  body?: string;
  type?: string;
  meta?: NotificationMeta;
  created_at?: string;
  read_at?: string | null;
}

export interface NotificationsResponse {
  notifications: AppNotification[];
}

export interface MarkReadResponse {
  id: string;
  read_at: string | null;
}

export interface MarkAllReadResponse {
  unread: number;
}

export const notificationsApi = {
  list: () => browserApi.get<NotificationsResponse>(userNotificationRoutes.LIST),

  markAllAsRead: () => browserApi.patch<MarkAllReadResponse>(userNotificationRoutes.READ_ALL),

  markAsRead: (id: string) =>
    browserApi.patch<MarkReadResponse>(buildPath(userNotificationRoutes.READ, { id })),
};
