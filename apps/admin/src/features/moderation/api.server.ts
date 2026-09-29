import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminModerationRoutes, buildPath } from "@lemonade/api-types/generated";
import type {
  ModerationContentType,
  ModerationContentFilters,
  ModerationContentListResponse,
  ModerationQueueResponse,
} from "./api";

export const moderationServerApi = {
  getQueue: () => backendApi.get<ModerationQueueResponse>(adminModerationRoutes.QUEUE),

  getContent: (type: ModerationContentType, filters?: ModerationContentFilters) =>
    backendApi.get<ModerationContentListResponse>(
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
};
