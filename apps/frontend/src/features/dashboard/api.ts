// Endpoint layer for the dashboard domain — see features/events/api.ts for
// the pattern this follows. Still on the pre-BFF axiosInstance transport
// deliberately (Phase 5 concern, not this refactor).
import { axiosInstance } from "@/lib/axiosInstane";
import { userDashboardRoutes } from "@lemonade/api-types";

// The per-call `{ cache: { ttl } }` option this used to pass only did
// anything while axiosInstance was wrapped in axios-cache-interceptor —
// removed along with that wrapper (see lib/axiosInstane.ts). A real
// per-query staleness policy is TanStack Query's job as this domain
// migrates (Phase 5), not axios-level caching.
export const dashboardApi = {
    getTribes: () => axiosInstance.get(userDashboardRoutes.TRIBES),
    getEvents: () => axiosInstance.get(userDashboardRoutes.EVENTS),
    getBusinesses: () => axiosInstance.get(userDashboardRoutes.BUSINESSES),
};
