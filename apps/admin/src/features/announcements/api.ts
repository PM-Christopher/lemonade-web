// Endpoint layer for the announcements domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminAnnouncementRoutes } from "@lemonade/api-types";

export const announcementsApi = {
    getAnnouncements: () => axiosInstance.get(adminAnnouncementRoutes.BASE),

    getAnnouncement: (id: number) =>
        axiosInstance.get(`${adminAnnouncementRoutes.BASE}/${id}`),
};
