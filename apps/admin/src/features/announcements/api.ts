// Endpoints for the announcements domain over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import {
  adminAnnouncementRoutes,
  adminPageContentRoutes,
  adminUtilitiesRoutes,
  buildPath,
} from "@lemonade/api-types/generated";

export interface AnnouncementRow {
  id: number;
  unique_id: string;
  title: string;
  created_by: { name: string; image: string | null };
  content: string;
  created_at: string;
  scheduled_date: string;
  // ISO times, shown in the viewer's own time zone.
  created_at_iso: string;
  scheduled_at: string;
  // draft, pending (scheduled) or sent.
  status: string;
}

export interface AnnouncementListResponse {
  announcements: AnnouncementRow[];
  count: number;
}

export interface AnnouncementDetailResponse {
  announcement: AnnouncementRow;
}

// Mirrors App\Http\Requests\Admin\AnnouncementRequest.
export interface AnnouncementPayload {
  title: string;
  content: string;
  draft: boolean;
  // "YYYY-MM-DD HH:mm:ss" in UTC.
  date_scheduled?: string;
}

export type PageContentCategory =
  "terms_and_conditions" | "privacy_policy" | "community_guidelines";

export interface PageContentResponse {
  page_content: Partial<Record<PageContentCategory, string | null>> | null;
}

export const announcementsApi = {
  getAnnouncements: () => browserApi.get<AnnouncementListResponse>(adminAnnouncementRoutes.LIST),

  createAnnouncement: (payload: AnnouncementPayload) =>
    browserApi.post<AnnouncementDetailResponse>(adminAnnouncementRoutes.CREATE, payload),

  updateAnnouncement: (id: string | number, payload: AnnouncementPayload) =>
    browserApi.put<AnnouncementDetailResponse>(
      buildPath(adminAnnouncementRoutes.UPDATE, { id }),
      payload,
    ),

  getPageContent: () => browserApi.get<PageContentResponse>(adminPageContentRoutes.SHOW),

  savePageContent: (category: PageContentCategory, content: string) =>
    browserApi.post<PageContentResponse>(adminPageContentRoutes.SAVE, { category, content }),

  // Images and short videos for announcement and policy bodies. Returns the file's address.
  uploadMedia: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const result = await browserApi.post<{ image: string }>(adminUtilitiesRoutes.UPLOAD, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return result.image;
  },

  getAnnouncement: (id: string | number) =>
    browserApi.get<AnnouncementDetailResponse>(buildPath(adminAnnouncementRoutes.SHOW, { id })),
};
