// Server-side twin of api.ts's client endpoints — for prefetching in a
// Server Component (see app/(main)/event/[id]/details/page.tsx), not for
// use from a Client Component (browserApi already covers that; this uses
// the direct-to-backend transport instead of the BFF proxy round-trip,
// since a Server Component is already running server-side).
//
// Same logical endpoints as api.ts's client versions — kept in sync by
// hand for now. If more pages need server-side prefetching, this is the
// pattern: one api.server.ts per feature, only the endpoints that are
// actually prefetched (not a wholesale server-side mirror of api.ts).
import "server-only";
import { backendApi } from "@/lib/server-api";
import { userEventsRoutes, buildPath } from "@lemonade/api-types/generated";
import type {
  EventDetailResponse,
  GuestListResponse,
  AffiliateEventDetailResponse,
  EventTicketDataResponse,
  EventTicketsResponse,
  PromotionsResponse,
  EventsListResponse,
} from "./api";

export const eventsServerApi = {
  getEvent: (id: number | string) =>
    backendApi.get<EventDetailResponse>(buildPath(userEventsRoutes.SHOW, { id })),

  getEvents: () => backendApi.get<EventsListResponse>(userEventsRoutes.ATTENDEES_LIST),

  getGuestList: (id: number | string) =>
    backendApi.get<GuestListResponse>(buildPath(userEventsRoutes.GUEST_LIST, { id })),

  getAffiliateEvent: (id: number | string) =>
    backendApi.get<AffiliateEventDetailResponse>(
      buildPath(userEventsRoutes.AFFILIATE_SHOW, { id }),
    ),

  getEventTicketData: (id: number | string) =>
    backendApi.get<EventTicketDataResponse>(buildPath(userEventsRoutes.ATTENDEES_TICKETS, { id })),

  getEventTickets: (id: number | string) =>
    backendApi.get<EventTicketsResponse>(buildPath(userEventsRoutes.EVENT_TICKETS, { id })),

  getPromotions: () => backendApi.get<PromotionsResponse>(userEventsRoutes.PROMOTIONS),
};
