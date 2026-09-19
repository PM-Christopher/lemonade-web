// Endpoint layer for the dashboard domain — see features/authentication/api.ts
// for the pattern this follows: the BFF proxy transport (browserApi), not
// the pre-BFF axiosInstance.
import { browserApi } from "@/lib/browser-api";
import { userDashboardRoutes } from "@lemonade/api-types/generated";
import type { TribeInterface } from "@/interfaces/TribeInterface";
import type { EventInterface } from "@/interfaces/EventInterface";
import type { BusinessInterface } from "@/interfaces/BusinessInterface";

export interface DashboardTribesResponse {
  tribes: TribeInterface[];
}

export interface DashboardEventsResponse {
  events: EventInterface[];
}

export interface DashboardBusinessesResponse {
  businesses: BusinessInterface[];
}

export const dashboardApi = {
  getTribes: () => browserApi.get<DashboardTribesResponse>(userDashboardRoutes.TRIBES),
  getEvents: () => browserApi.get<DashboardEventsResponse>(userDashboardRoutes.EVENTS),
  getBusinesses: () => browserApi.get<DashboardBusinessesResponse>(userDashboardRoutes.BUSINESSES),
};
