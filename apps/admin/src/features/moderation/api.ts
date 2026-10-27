// Endpoint layer for content moderation. The backend lists every type the same way.
import { browserApi } from "@/lib/browser-api";
import { adminModerationRoutes, buildPath } from "@lemonade/api-types/generated";

export type ModerationContentType = "forums" | "forum-comments" | "threads" | "thread-comments";

export type ForumStatus = "active" | "inactive" | "suspended";

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
  // Where it was posted, such as the tribe a thread is in.
  context: string | null;
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

  getContentItem: (type: ModerationContentType, id: string | number) =>
    browserApi.get<{ content: ModerationContentItem }>(
      buildPath(adminModerationRoutes.CONTENT_SHOW, { type, id }),
    ),

  updateForumStatus: (id: string | number, status: ForumStatus) =>
    browserApi.patch<{ content: ModerationContentItem }>(
      buildPath(adminModerationRoutes.FORUMS_STATUS, { id }),
      { status },
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
