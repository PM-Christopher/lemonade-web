// Endpoints for the dashboard domain over the BFF transport (browserApi).
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
