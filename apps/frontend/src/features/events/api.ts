// Endpoint layer for the events domain — see features/tribes/api.ts for the
// pattern this follows: the BFF proxy transport (browserApi), not the
// pre-BFF axiosInstance.
//
// NOTE: getAffiliateData/GetAffiliateDashboard's backend action returns
// `[[ ...fields ]]` — a numerically-indexed array wrapping a single object,
// not the object directly (confirmed by reading the action source). The
// pre-migration frontend already relied on this exact shape (`reduce`-ing
// over what is really a one-element array), so AffiliateDashboardResponse
// is typed to match reality rather than what looks intended — a real
// backend inconsistency, documented rather than silently "fixed" here.
//
// getMyTickets/getMyTicket aren't reached through event.slice.ts at all —
// components/events/SideMenu.tsx calls them directly via the legacy
// useRequest hook (a real, live consumer, just not one grep for the slice's
// thunks would find) — migrated here too since they're the same domain and
// already surfaced. deleteEvent genuinely has zero real consumers
// (confirmed via grep) — not migrated, matching the "dead code, dropped
// rather than migrated" rule from every other domain this session.
import { browserApi } from "@/lib/browser-api";
import { userEventsRoutes, buildPath } from "@lemonade/api-types/generated";
import type {
  EventInterface,
  TicketInterface,
  GuestListCardProps,
  PromotionInterface,
  MyTicketInterface,
  EventTicketInterface,
} from "@/interfaces/EventInterface";

export interface EventsListResponse {
  this_week: EventInterface[];
  upcoming: EventInterface[];
  trending: EventInterface[];
}

// The owner-only fields GetUserEvent adds on top of the base event shape
// when the viewer owns the event (see the action's `$event['user_id'] ===
// $user->id` branch) — absent entirely for a non-owner viewer.
interface EventOwnerBreakdown {
  sales_revenue: number;
  tickets_sold: { sold: number; count: number };
  checkins: { percentage: number; count: number; total: number };
}

interface EventTicketBreakdownRow {
  name: string;
  stock: number;
  price?: number;
  bought?: number;
  percentage_sold?: number;
  checked_id?: number;
  checkin_count?: number;
  stock_type: string;
}

export interface EventDetailResponse {
  event: EventInterface & {
    breakdown?: EventOwnerBreakdown;
    sales_revenue?: {
      sales_revenue_breakdown: EventTicketBreakdownRow[];
      tickets_sold_breakdown: EventTicketBreakdownRow[];
      tickets_checkins_breakdown: EventTicketBreakdownRow[];
    };
    promotion?: {
      id: number;
      name: string;
      price: number;
      image: string;
      status: string;
      promotion_date: string;
      breakdown: string[];
    }[];
  };
}

export interface CreateEventPayload {
  event: Record<string, unknown> | unknown;
  tickets?: unknown[];
  bank?: { bank_name: string; account_name: string; account_number: string };
}

export interface UpdateEventPayload {
  event: Record<string, unknown>;
}

export interface EventTicketsResponse {
  tickets: unknown[];
}

export interface EditEventTicketsPayload {
  tickets: unknown[];
}

export interface OrganizerEventsResponse {
  upcoming: EventInterface[];
  past: EventInterface[];
  drafts: EventInterface[];
  pending: EventInterface[];
  rejected: EventInterface[];
}

export interface AffiliateEventsResponse {
  events: EventInterface[];
}

// See the file-level note above — this really is an array with one entry.
export type AffiliateDashboardResponse = [
  {
    total_commission: number;
    tickets_sold: number;
    promotions: EventInterface[];
    find_events: EventInterface[];
  },
];

export interface EventTicketDataResponse {
  event: EventInterface;
  tickets: TicketInterface[];
}

export interface GuestListResponse {
  guest_list: GuestListCardProps[];
}

export interface GuestSearchResponse {
  guest_list: GuestListCardProps[];
  meta: { current_page: number; per_page: number; total: number; last_page: number };
}

export interface GuestDetailsResponse {
  guest_details: unknown;
}

export interface PromotionsResponse {
  promotions: PromotionInterface[];
}

export interface PayForPromotionPayload {
  promo: number | undefined;
  unit: number;
  promotion_date: string;
  redirect_url: string;
}

export interface PayForPromotionResponse {
  authorization_url: string;
  reference: string;
}

export interface EventPromotionResponse {
  promotion: unknown;
}

// AFFILIATE/{id} — the frontend's own thunk calls this `getProgram`, but the
// backend action is GetAffiliateEvent: agent-facing event detail plus the
// viewer's own affiliate commission/ticket-sold breakdown for it.
export interface AffiliateEventDetailResponse {
  events: EventInterface & {
    isAffiliate: boolean;
    affiliate_link?: string;
    breakdown?: { total_commissions: number; ticket_sold: number };
    commissions?: unknown[];
    ticket_sold?: unknown[];
  };
}

export interface GenerateAffiliateLinkResponse {
  affiliate_program: unknown;
  generated_link: string;
  referral_id: string;
  events: AffiliateEventDetailResponse["events"];
}

export interface SearchAffiliateEventsResponse {
  events: EventInterface[];
}

export interface SearchEventsResponse {
  events: EventInterface[];
}

export interface FilterEventsPayload {
  category: string;
  period: string;
  start_date: string;
  end_date: string;
  location: string;
}

export interface FilterEventsResponse {
  events: EventInterface[];
}

export interface PaymentSettingResponse {
  payment_setting: { type: string } | null;
}

export interface BuyTicketPayload {
  tickets?: { id: string; quantity: number }[];
  assigned_tickets?: { id: string; quantity: number; fullname: string; email: string }[];
  assign_multiple: boolean;
  fullname: string;
  email: string;
  redirect_url: string;
  referral: string | null;
}

export interface BuyTicketResponse {
  completed?: boolean;
  payment_url?: string;
  order_id?: number | string;
}

export interface MyTicketsResponse {
  upcoming: MyTicketInterface[];
  past: MyTicketInterface[];
}

export interface MyTicketResponse {
  ticket: EventTicketInterface[];
}

export const eventsApi = {
  // ATTENDEES_LIST — the public "discover events" list (this_week/upcoming/trending).
  getEvents: () => browserApi.get<EventsListResponse>(userEventsRoutes.ATTENDEES_LIST),

  getEvent: (id: number | string) =>
    browserApi.get<EventDetailResponse>(buildPath(userEventsRoutes.SHOW, { id })),

  createEvent: (data: CreateEventPayload) =>
    browserApi.post<EventDetailResponse>(userEventsRoutes.CREATE, data),

  updateEvent: (id: number | string, data: UpdateEventPayload) =>
    browserApi.put<EventDetailResponse>(buildPath(userEventsRoutes.UPDATE, { id }), data),

  publishEvent: (id: number | string) =>
    browserApi.patch<EventDetailResponse>(buildPath(userEventsRoutes.PUBLISH, { id })),

  getEventTickets: (id: number | string) =>
    browserApi.get<EventTicketsResponse>(buildPath(userEventsRoutes.EVENT_TICKETS, { id })),

  editEventTickets: (id: number | string, data: EditEventTicketsPayload) =>
    browserApi.patch<EventTicketsResponse>(buildPath(userEventsRoutes.EDIT_TICKETS, { id }), data),

  getOrganizerEvents: () => browserApi.get<OrganizerEventsResponse>(userEventsRoutes.LIST),

  getPaymentSetting: () =>
    browserApi.get<PaymentSettingResponse>(userEventsRoutes.PAYMENT_SETTING_SHOW),

  updatePaymentSetting: (data: { type: string }) =>
    browserApi.patch<PaymentSettingResponse>(userEventsRoutes.PAYMENT_SETTING_UPDATE, data),

  filterEvents: (data: FilterEventsPayload) =>
    browserApi.get<FilterEventsResponse>(userEventsRoutes.FILTER, { params: data }),

  searchEvents: (data: { search: string }) =>
    browserApi.post<SearchEventsResponse>(userEventsRoutes.SEARCH, data),

  getAffiliateEvents: () => browserApi.get<AffiliateEventsResponse>(userEventsRoutes.AFFILIATE_LIST),

  getAffiliateEvent: (id: number | string) =>
    browserApi.get<AffiliateEventDetailResponse>(buildPath(userEventsRoutes.AFFILIATE_SHOW, { id })),

  getAffiliateData: () =>
    browserApi.get<AffiliateDashboardResponse>(userEventsRoutes.AFFILIATE_DATA),

  generateAffiliateLink: (id: number | string) =>
    browserApi.post<GenerateAffiliateLinkResponse>(
      buildPath(userEventsRoutes.AFFILIATE_GENERATE_LINK, { id }),
    ),

  searchAffiliateEvents: (data: { search: string }) =>
    browserApi.post<SearchAffiliateEventsResponse>(userEventsRoutes.SEARCH_AFFILIATE, data),

  getPromotions: () => browserApi.get<PromotionsResponse>(userEventsRoutes.PROMOTIONS),

  payForPromotion: (id: number | string, data: PayForPromotionPayload) =>
    browserApi.post<PayForPromotionResponse>(buildPath(userEventsRoutes.PROMOTE, { id }), data),

  getEventPromotion: (id: number | string, promotionId: number | string) =>
    browserApi.get<EventPromotionResponse>(
      buildPath(userEventsRoutes.EVENT_PROMOTION, { id, promo_id: promotionId }),
    ),

  buyTicket: (eventId: number | string, data: BuyTicketPayload) =>
    browserApi.post<BuyTicketResponse>(
      buildPath(userEventsRoutes.ATTENDEES_ASSIGN_TICKETS, { id: eventId }),
      data,
    ),

  getEventTicketData: (id: number | string) =>
    browserApi.get<EventTicketDataResponse>(buildPath(userEventsRoutes.ATTENDEES_TICKETS, { id })),

  getGuestList: (id: number | string) =>
    browserApi.get<GuestListResponse>(buildPath(userEventsRoutes.GUEST_LIST, { id })),

  getGuestListDetails: (id: number | string, guestId: number | string) =>
    browserApi.get<GuestDetailsResponse>(
      buildPath(userEventsRoutes.GUEST_DETAILS, { id, guest_id: guestId }),
    ),

  checkInGuest: (id: number | string, guestId: number | string) =>
    browserApi.patch<GuestDetailsResponse>(
      buildPath(userEventsRoutes.CHECK_IN, { id, guest_id: guestId }),
    ),

  guestSearch: (id: number | string, q: string) =>
    browserApi.post<GuestSearchResponse>(
      buildPath(userEventsRoutes.SEARCH_GUEST_LIST, { id }),
      null,
      { params: { q } },
    ),

  getMyTickets: () => browserApi.get<MyTicketsResponse>(userEventsRoutes.ATTENDEES_MY_TICKETS),

  getMyTicket: (id: number | string) =>
    browserApi.get<MyTicketResponse>(buildPath(userEventsRoutes.ATTENDEES_MY_TICKET, { id })),
};
