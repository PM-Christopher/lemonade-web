// Endpoint layer for the events domain (covers what event.slice.ts and
// promotion.slice.ts used to own) — see features/team/api.ts for the pattern
// this follows: the BFF proxy transport (browserApi), not the pre-BFF
// axiosInstance.
//
// NOTE: /admin/affiliates/{id} (EventController::affiliate), /admin/event-
// promotions/{id} (eventPromotion), .../schedule and .../completed have no
// real frontend consumer — events/[id]/affiliates/page.tsx and
// events/[id]/promotions/page.tsx are fully static placeholders that don't
// fetch anything. Not wired up here, matching the "only build what's
// actually used" rule this migration has followed throughout.
import { browserApi } from "@/lib/browser-api";
import {
  adminEventsRoutes,
  adminAffiliatesRoutes,
  adminEventPromotionsRoutes,
  adminPromotionsRoutes,
  buildPath,
} from "@lemonade/api-types/generated";

export interface EventOrganiser {
  id: number;
  name: string;
  username: string;
  image: string | null;
}

export interface AdminEventListItem {
  id: number;
  unique_id: string;
  event_name: string;
  event_image: string | null;
  event_type: string;
  category: string;
  date_created_at: string;
  status: string;
  start_date: string;
  end_date: string;
  rejection_reason: string | null;
  reviewed_at: string | null;
  organiser?: EventOrganiser;
}

export interface EventListResponse {
  events: AdminEventListItem[];
  total_events: number;
  tickets_commission: number;
  commission_charge: number;
}

export interface EventAffiliateListItem {
  id: number;
  unique_id: string;
  name: string;
  image: string | null;
  programs: number;
  date_joined: string;
}

export interface EventAffiliatesResponse {
  affiliates: EventAffiliateListItem[];
  total_affiliate_earning: number;
  total_affiliates: number;
}

export interface EventPromotionQueueItem {
  id: number;
  event_name: string;
  event_image: string | null;
  promotion_name: string;
  promotion_price: number;
  date_paid: string;
  status: string;
}

export interface EventPromotionsQueueResponse {
  promotions_revenue: number;
  total_promotions: number;
  offered_promotions: number;
  history: EventPromotionQueueItem[];
}

export interface EventTicket {
  id: number;
  ticket_type: string;
  description: string;
  stock_type: string;
  price: number;
  purchase_limit: number;
  tickets_sold: number;
  sales_revenue: number;
  check_ins: number;
}

export interface EventDetail {
  id: number;
  owner: { fullname: string; image: string | null };
  event_name: string;
  event_image: string | null;
  event_date: string;
  event_time: string;
  status: string;
  location: string;
  created_at: string;
  category: string;
  socials: unknown;
  description: string;
  promotions: unknown[];
  account: { name: string | null; bank: string | null; account_number: string | null };
}

export interface EventDetailResponse {
  event: EventDetail;
  tickets: EventTicket[];
}

export const eventsApi = {
  getEventData: (
    trxType: string,
  ): Promise<EventListResponse | EventAffiliatesResponse | EventPromotionsQueueResponse> => {
    switch (trxType) {
      case "affiliates":
        return browserApi.get<EventAffiliatesResponse>(adminAffiliatesRoutes.LIST);
      case "promotions":
        return browserApi.get<EventPromotionsQueueResponse>(adminEventPromotionsRoutes.LIST);
      case "events":
      default:
        return browserApi.get<EventListResponse>(adminEventsRoutes.LIST);
    }
  },

  getEventDetail: (id: number) =>
    browserApi.get<EventDetailResponse>(buildPath(adminEventsRoutes.SHOW, { id })),

  suspendEvent: (id: number) =>
    browserApi.patch<{ suspended: boolean }>(buildPath(adminEventsRoutes.SUSPEND, { id }), {}),

  activateEvent: (id: number) =>
    browserApi.patch<{ activated: boolean }>(buildPath(adminEventsRoutes.ACTIVATE, { id }), {}),

  deleteEvent: (id: number) =>
    browserApi.delete<{ deleted: boolean }>(buildPath(adminEventsRoutes.DELETE, { id })),

  updateCommissionCharge: (commissionCharge: number) =>
    browserApi.patch<{ setting: { commission_charge: number } }>(
      adminEventsRoutes.UPDATE_COMMISSION_CHARGE,
      {
        commission_charge: commissionCharge,
      },
    ),
};

export interface Promotion {
  id: number;
  name: string;
  price: number;
  price_option: string;
  breakdown: string[];
  image: string | null;
}

export interface PromotionListResponse {
  promotions: Promotion[];
}

export interface PromotionDetailResponse {
  promotion: Promotion;
}

export interface PromotionPayload {
  name: string;
  price_option: string;
  // Must be a JSON number, not a numeric string — found live-testing:
  // Money::fromUnits() (called from CreatePromotion/UpdatePromotion
  // actions) only accepts int|float and 500s on a string, even though the
  // FormRequest's `numeric` rule accepts either. The old thunk sent
  // formik's raw string value, so this was silently broken before too.
  price: number;
  breakdown: string[];
  // Required by the backend (CreatePromotionRequest/UpdatePromotionRequest)
  // but never collected by CreatePromotionModal.tsx's form — found, not
  // fixed, see the NOTE on promotionsApi below.
  image: string;
}

export const promotionsApi = {
  getPromotions: () => browserApi.get<PromotionListResponse>(adminPromotionsRoutes.LIST),

  // NOTE (found live-testing, not fixed — pre-existing broken feature, not
  // introduced by this migration): the backend requires an `image` field
  // on create/update (CreatePromotionRequest/UpdatePromotionRequest both
  // mark it `required|string`), but CreatePromotionModal.tsx's form never
  // collects or sends one. Every create/update submission 422s. Needs an
  // image-upload UI, which is a real feature addition, not a transport
  // migration — out of scope here.
  createPromotion: (data: PromotionPayload) =>
    browserApi.post<PromotionDetailResponse>(adminPromotionsRoutes.CREATE, data),

  getPromotion: (id: number) =>
    browserApi.get<PromotionDetailResponse>(buildPath(adminPromotionsRoutes.SHOW, { id })),

  updatePromotion: (id: number, data: PromotionPayload) =>
    browserApi.patch<PromotionDetailResponse>(buildPath(adminPromotionsRoutes.UPDATE, { id }), data),

  deletePromotion: (id: number) =>
    browserApi.delete<{ deleted: boolean }>(buildPath(adminPromotionsRoutes.DELETE, { id })),
};
