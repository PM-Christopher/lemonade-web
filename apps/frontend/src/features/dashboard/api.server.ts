// Server-side twin of api.ts's client endpoints — for prefetching in a
// Server Component. Same pattern as features/events/api.server.ts: only
// the endpoints actually prefetched, using backendApi (direct-to-backend)
// instead of browserApi (BFF-proxy, client-only).
import "server-only";
import { backendApi } from "@/lib/server-api";
import { userDashboardRoutes } from "@lemonade/api-types/generated";
import type {
  DashboardTribesResponse,
  DashboardEventsResponse,
  DashboardBusinessesResponse,
} from "./api";

export const dashboardServerApi = {
  getTribes: () => backendApi.get<DashboardTribesResponse>(userDashboardRoutes.TRIBES),
  getEvents: () => backendApi.get<DashboardEventsResponse>(userDashboardRoutes.EVENTS),
  getBusinesses: () => backendApi.get<DashboardBusinessesResponse>(userDashboardRoutes.BUSINESSES),
};
