// Endpoint layer for the announcements domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminAnnouncementRoutes } from "@lemonade/api-types";

const authHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
});

export const announcementsApi = {
    getAnnouncements: (token: string) => axiosInstance.get(adminAnnouncementRoutes.BASE, { headers: authHeaders(token) }),

    getAnnouncement: (token: string, id: number) =>
        axiosInstance.get(`${adminAnnouncementRoutes.BASE}/${id}`, { headers: authHeaders(token) }),
};
