// Endpoint layer for the content-moderation domain — see features/reporting/
// api.ts for the pattern this follows: the BFF proxy transport (browserApi).
//
// The backend's moderation content actions (lemonade-backend's
// InteractsWithModeratedContent) are generic across six content types —
// forums, forum-comments, threads, thread-comments, tribes, tribe-comments —
// but this feature only surfaces "forums" and "forum-comments", matching
// the "Forum posts/comments moderation" deliverable this was built for.
// The other four types are reachable with the same functions below by
// widening ModerationContentType, if a future deliverable needs them.
import { browserApi } from "@/lib/browser-api";
import { adminModerationRoutes, buildPath } from "@lemonade/api-types/generated";

export type ModerationContentType = "forums" | "forum-comments";

export interface ModerationContentAuthor {
  id: number;
  name: string;
  username: string;
  image: string | null;
}

export interface ModerationContentItem {
  id: number;
  type: string;
  type_label: string;
  title: string | null;
  body: string | null;
  status: string | null;
  author: ModerationContentAuthor | null;
  created_at: string;
  deleted_at: string | null;
}

export interface ModerationContentMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ModerationContentListResponse {
  type: string;
  content: ModerationContentItem[];
  meta: ModerationContentMeta;
}

export interface ModerationQueueCount {
  count: number;
}

export interface ModerationQueueResponse {
  pending_events: ModerationQueueCount;
  pending_businesses: ModerationQueueCount;
  open_reports: ModerationQueueCount;
  recently_removed_content: Record<string, ModerationContentItem[]>;
}

export interface ModerationContentFilters {
  deleted?: boolean;
  search?: string;
  page?: number;
  perPage?: number;
}

export const moderationApi = {
  getQueue: () => browserApi.get<ModerationQueueResponse>(adminModerationRoutes.QUEUE),

  getContent: (type: ModerationContentType, filters?: ModerationContentFilters) =>
    browserApi.get<ModerationContentListResponse>(
      buildPath(adminModerationRoutes.CONTENT_LIST, { type }),
      {
        params: {
          deleted: filters?.deleted ? "1" : undefined,
          search: filters?.search || undefined,
          page: filters?.page,
          per_page: filters?.perPage,
        },
      },
    ),

  deleteContent: (type: ModerationContentType, id: number) =>
    browserApi.delete<{ deleted: boolean; type: string; id: string }>(
      buildPath(adminModerationRoutes.CONTENT_DELETE, { type, id }),
    ),

  restoreContent: (type: ModerationContentType, id: number) =>
    browserApi.patch<{ content: ModerationContentItem }>(
      buildPath(adminModerationRoutes.CONTENT_RESTORE, { type, id }),
      {},
    ),
};
