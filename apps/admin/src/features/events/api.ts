// Endpoints for the events domain over the BFF transport (browserApi).
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

/** Events waiting for approval. */
export type EventPendingResponse = Pick<EventListResponse, "events">;

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

export interface EventAffiliateTicketBreakdown {
  name: string;
  count: number;
  stock: number;
  price: number;
  stock_type: string;
}

export interface EventAffiliateTicketSoldBreakdown extends EventAffiliateTicketBreakdown {
  percentage_sold: number;
}

export interface EventAffiliateProgram {
  event_name: string;
  start_date: string;
  location: string | null;
  affiliate_link: string;
  isAffiliate: boolean;
  commissions: EventAffiliateTicketBreakdown[];
  ticket_sold: EventAffiliateTicketSoldBreakdown[];
  breakdown: {
    total_commissions: number;
    ticket_sold: number;
  };
}

export interface EventAffiliateDetail {
  id: number;
  unique_id: string;
  name: string;
  image: string | null;
  date_joined: string;
  programs: number;
  tickets_sold: number;
  total_revenue: number;
  account: {
    account_name: string;
    bank_name: string;
    account_number: string;
  } | null;
}

export interface EventAffiliateDetailResponse {
  affiliate: EventAffiliateDetail;
  programs: EventAffiliateProgram[];
}

/** What the events page holds for whichever tab is open. */
export type EventTabData =
  EventListResponse | EventAffiliatesResponse | EventPromotionsQueueResponse | EventPendingResponse;

export interface EventPromotionQueueItem {
  id: string;
  unique_id: string | null;
  event_name: string;
  event_image: string | null;
  promotion_name: string;
  promotion_price: string;
  date_paid: string;
  status: string;
}

export interface EventPromotionsQueueResponse {
  promotions_revenue: number;
  total_promotions: number;
  offered_promotions: number;
  history: EventPromotionQueueItem[];
}

export interface EventPromotionDetail {
  event_summary: {
    id: string;
    unique_id: string | null;
    event_name: string;
    event_image: string | null;
    owner: string;
    promotion_name: string;
    promotion_price: string;
    date_paid: string;
    promotion_date: string | null;
    status: string;
  };
  event: {
    id: string;
    image: string | null;
    name: string;
    event_date: string;
    event_time: string;
    location: string | null;
    description: string | null;
    promotions: unknown[] | null;
  };
}

export const eventPromotionsApi = {
  getDetail: (id: string) =>
    browserApi.get<EventPromotionDetail>(buildPath(adminEventPromotionsRoutes.SHOW, { id })),

  schedule: (id: string, promotionDate: string) =>
    browserApi.post<{ scheduled: boolean }>(
      buildPath(adminEventPromotionsRoutes.SCHEDULE, { id }),
      { promotion_date: promotionDate },
    ),

  complete: (id: string) =>
    browserApi.patch<{ completed: boolean }>(
      buildPath(adminEventPromotionsRoutes.COMPLETED, { id }),
      {},
    ),
};

export interface EventTicket {
  id: number;
  ticket_type: string;
  description: string;
  stock_type: string;
  price: number;
  purchase_limit: number;
  tickets_sold: number;
  // Naira, formatted by the backend.
  sales_revenue: string;
  check_ins: number;
}

export interface EventDetail {
  id: number;
  unique_id: string | null;
  owner: { fullname: string; image: string | null };
  event_name: string;
  event_image: string | null;
  event_date: string;
  event_time: string;
  status: string;
  rejection_reason: string | null;
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
  ): Promise<
    | EventListResponse
    | EventAffiliatesResponse
    | EventPromotionsQueueResponse
    | EventPendingResponse
  > => {
    switch (trxType) {
      case "pending":
        return browserApi.get<EventPendingResponse>(adminEventsRoutes.PENDING);
      case "affiliates":
        return browserApi.get<EventAffiliatesResponse>(adminAffiliatesRoutes.LIST);
      case "promotions":
        return browserApi.get<EventPromotionsQueueResponse>(adminEventPromotionsRoutes.LIST);
      case "events":
      default:
        return browserApi.get<EventListResponse>(adminEventsRoutes.LIST);
    }
  },

  getEventDetail: (id: string | number) =>
    browserApi.get<EventDetailResponse>(buildPath(adminEventsRoutes.SHOW, { id })),

  getEventAffiliateDetail: (id: string | number) =>
    browserApi.get<EventAffiliateDetailResponse>(buildPath(adminAffiliatesRoutes.SHOW, { id })),

  suspendEvent: (id: string | number) =>
    browserApi.patch<{ suspended: boolean }>(buildPath(adminEventsRoutes.SUSPEND, { id }), {}),

  activateEvent: (id: string | number) =>
    browserApi.patch<{ activated: boolean }>(buildPath(adminEventsRoutes.ACTIVATE, { id }), {}),

  deleteEvent: (id: string | number) =>
    browserApi.delete<{ deleted: boolean }>(buildPath(adminEventsRoutes.DELETE, { id })),

  approveEvent: (id: string | number) =>
    browserApi.patch<{ event: EventDetail }>(buildPath(adminEventsRoutes.APPROVE, { id }), {}),

  rejectEvent: (id: string | number, reason: string) =>
    browserApi.patch<{ event: EventDetail }>(buildPath(adminEventsRoutes.REJECT, { id }), {
      reason,
    }),

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
  // The price in naira, formatted by the backend (`price` is kobo).
  price_naira: string;
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
  // the form's raw string value, so this was silently broken before too.
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
    browserApi.patch<PromotionDetailResponse>(
      buildPath(adminPromotionsRoutes.UPDATE, { id }),
      data,
    ),

  deletePromotion: (id: number) =>
    browserApi.delete<{ deleted: boolean }>(buildPath(adminPromotionsRoutes.DELETE, { id })),
};
