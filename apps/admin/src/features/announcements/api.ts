// Endpoint layer for the announcements domain — see features/dashboard/api.ts
// for the pattern this follows: the BFF proxy transport (browserApi), not
// the pre-BFF axiosInstance.
import { browserApi } from "@/lib/browser-api";
import { adminAnnouncementRoutes } from "@lemonade/api-types";

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
    getAnnouncements: () => browserApi.get<AnnouncementListResponse>(adminAnnouncementRoutes.BASE),

    getAnnouncement: (id: number) =>
        browserApi.get<AnnouncementDetailResponse>(`${adminAnnouncementRoutes.BASE}/${id}`),
};
