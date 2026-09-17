import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminEventRoutes, adminPromotionRoutes } from "@lemonade/api-types";
import type {
  EventListResponse,
  EventDetailResponse,
  PromotionListResponse,
} from "./api";

export const eventsServerApi = {
  getEvents: () => backendApi.get<EventListResponse>(adminEventRoutes.BASE),

  getEventDetail: (id: number | string) =>
    backendApi.get<EventDetailResponse>(`${adminEventRoutes.BASE}/${id}`),
};

export const promotionsServerApi = {
  getPromotions: () =>
    backendApi.get<PromotionListResponse>(adminPromotionRoutes.BASE),
};
