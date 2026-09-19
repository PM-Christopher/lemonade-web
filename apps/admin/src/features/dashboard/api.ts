// Endpoint layer for the dashboard domain — see
// features/authentication/api.ts for the pattern this follows: the BFF
// proxy transport (browserApi), not the pre-BFF axiosInstance. First
// non-auth domain moved onto this transport + TanStack Query (Phase 5).
import { browserApi } from "@/lib/browser-api";
import { adminAccountRoutes } from "@lemonade/api-types/generated";
import type { PlatformStatistics } from "@/interfaces/SystemInterface";

export const dashboardApi = {
  getMetrics: () => browserApi.get<PlatformStatistics>(adminAccountRoutes.DASHBOARD),
};
