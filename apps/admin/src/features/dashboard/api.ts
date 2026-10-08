// Endpoints for the dashboard domain over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminAccountRoutes } from "@lemonade/api-types/generated";
import type { PlatformStatistics } from "@/interfaces/SystemInterface";

export const dashboardApi = {
  getMetrics: () => browserApi.get<PlatformStatistics>(adminAccountRoutes.DASHBOARD),
};
