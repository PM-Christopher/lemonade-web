// Endpoints for the signed-in user's notifications.
import { browserApi } from "@/lib/browser-api";
import { userNotificationRoutes } from "@lemonade/api-types/generated";

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
  user_id?: string;
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

export const notificationsApi = {
  list: () => browserApi.get<NotificationsResponse>(userNotificationRoutes.LIST),
};
