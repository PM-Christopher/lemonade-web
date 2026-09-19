import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminAnnouncementRoutes, buildPath } from "@lemonade/api-types/generated";
import type {
  AnnouncementListResponse,
  AnnouncementDetailResponse,
} from "./api";

export const announcementsServerApi = {
  getAnnouncements: () =>
    backendApi.get<AnnouncementListResponse>(adminAnnouncementRoutes.LIST),

  getAnnouncement: (id: number | string) =>
    backendApi.get<AnnouncementDetailResponse>(
      buildPath(adminAnnouncementRoutes.SHOW, { id }),
    ),
};
