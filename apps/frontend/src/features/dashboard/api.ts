// Endpoint layer for the dashboard domain — see features/events/api.ts for
// the pattern this follows. Still on the pre-BFF axiosInstance transport
// deliberately (Phase 5 concern, not this refactor).
import { axiosInstance } from "@/lib/axiosInstane";
import { userDashboardRoutes } from "@lemonade/api-types";

const oneMinuteCache = { cache: { ttl: 1000 * 60 } };

export const dashboardApi = {
    getTribes: () => axiosInstance.get(userDashboardRoutes.TRIBES, oneMinuteCache),
    getEvents: () => axiosInstance.get(userDashboardRoutes.EVENTS, oneMinuteCache),
    getBusinesses: () => axiosInstance.get(userDashboardRoutes.BUSINESSES, oneMinuteCache),
};
