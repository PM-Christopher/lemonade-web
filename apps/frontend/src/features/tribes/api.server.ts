// Server-side twin of api.ts's client endpoints — for prefetching in a
// Server Component (see app/(main)/tribe/[id]/page.tsx). Same convention
// as features/events/api.server.ts: only the endpoints actually
// prefetched, using the direct-to-backend transport since a Server
// Component is already running server-side.
import "server-only";
import { backendApi } from "@/lib/server-api";
import { userTribesRoutes, userThreadsRoutes, buildPath } from "@lemonade/api-types/generated";
import type { TribeDetailResponse, ThreadsResponse, TribesListResponse } from "./api";

export const tribesServerApi = {
  getTribe: (id: string) =>
    backendApi.get<TribeDetailResponse>(buildPath(userTribesRoutes.SHOW, { id })),

  getTribes: (tribeType: string) =>
    backendApi.get<TribesListResponse>(`${userTribesRoutes.LIST}?type=${tribeType}`),

  getThreads: (id: string) =>
    backendApi.get<ThreadsResponse>(buildPath(userTribesRoutes.THREADS_LIST, { forum: id })),

  getPinThreads: (id: string) =>
    backendApi.get<ThreadsResponse>(buildPath(userThreadsRoutes.PINNED, { id })),
};
