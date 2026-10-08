// Endpoints for the announcements domain over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminAnnouncementRoutes, buildPath } from "@lemonade/api-types/generated";

export interface AnnouncementRow {
  id: number;
  unique_id: string;
  title: string;
  created_by: { name: string; image: string | null };
  content: string;
  created_at: string;
  scheduled_date: string;
  status: string;
}

export interface AnnouncementListResponse {
  announcements: AnnouncementRow[];
  count: number;
}

export interface AnnouncementDetailResponse {
  announcement: AnnouncementRow;
}

export const announcementsApi = {
  getAnnouncements: () => browserApi.get<AnnouncementListResponse>(adminAnnouncementRoutes.LIST),

  getAnnouncement: (id: string | number) =>
    browserApi.get<AnnouncementDetailResponse>(buildPath(adminAnnouncementRoutes.SHOW, { id })),
};
