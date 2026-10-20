import "server-only";
import { backendApi } from "@/lib/server-api";
import {
  adminEventsRoutes,
  adminAffiliatesRoutes,
  adminEventPromotionsRoutes,
  adminPromotionsRoutes,
  buildPath,
} from "@lemonade/api-types/generated";
import type {
  EventListResponse,
  EventDetailResponse,
  EventAffiliateDetailResponse,
  EventPromotionDetail,
  PromotionListResponse,
} from "./api";

export const eventsServerApi = {
  getEvents: () => backendApi.get<EventListResponse>(adminEventsRoutes.LIST),

  getEventDetail: (id: number | string) =>
    backendApi.get<EventDetailResponse>(buildPath(adminEventsRoutes.SHOW, { id })),

  getEventAffiliateDetail: (id: number | string) =>
    backendApi.get<EventAffiliateDetailResponse>(buildPath(adminAffiliatesRoutes.SHOW, { id })),
};

export const promotionsServerApi = {
  getPromotions: () => backendApi.get<PromotionListResponse>(adminPromotionsRoutes.LIST),
};

export const eventPromotionsServerApi = {
  getDetail: (id: string) =>
    backendApi.get<EventPromotionDetail>(buildPath(adminEventPromotionsRoutes.SHOW, { id })),
};
