import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminAnnouncementRoutes } from "@lemonade/api-types";
import type {
  AnnouncementListResponse,
  AnnouncementDetailResponse,
} from "./api";

export const announcementsServerApi = {
  getAnnouncements: () =>
    backendApi.get<AnnouncementListResponse>(adminAnnouncementRoutes.BASE),

  getAnnouncement: (id: number | string) =>
    backendApi.get<AnnouncementDetailResponse>(
      `${adminAnnouncementRoutes.BASE}/${id}`,
    ),
};
