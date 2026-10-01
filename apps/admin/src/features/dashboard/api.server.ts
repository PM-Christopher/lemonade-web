import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminAccountRoutes } from "@lemonade/api-types/generated";
import type { PlatformStatistics } from "@/interfaces/SystemInterface";

export const dashboardServerApi = {
  getMetrics: () => backendApi.get<PlatformStatistics>(adminAccountRoutes.DASHBOARD),
};
