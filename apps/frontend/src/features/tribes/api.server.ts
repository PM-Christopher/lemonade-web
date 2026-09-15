// Server-side twin of api.ts's client endpoints — for prefetching in a
// Server Component (see app/(main)/tribe/[id]/page.tsx). Same convention
// as features/events/api.server.ts: only the endpoints actually
// prefetched, using the direct-to-backend transport since a Server
// Component is already running server-side.
import "server-only";
import { backendApi } from "@/lib/server-api";
import { userTribeRoutes } from "@lemonade/api-types";
import type { TribeDetailResponse, ThreadsResponse } from "./api";

export const tribesServerApi = {
  getTribe: (id: string) => backendApi.get<TribeDetailResponse>(`${userTribeRoutes.BASE}/${id}`),

  getThreads: (id: string) =>
    backendApi.get<ThreadsResponse>(`${userTribeRoutes.BASE}/${id}/threads/all`),

  getPinThreads: (id: string) =>
    backendApi.get<ThreadsResponse>(`${userTribeRoutes.THREADS_PINNED}/${id}/pinned`),
};
