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
import { userEventRoutes } from "@lemonade/api-types";
import type {
  EventDetailResponse,
  GuestListResponse,
  AffiliateEventDetailResponse,
  EventTicketDataResponse,
} from "./api";

export const eventsServerApi = {
  getEvent: (id: number | string) =>
    backendApi.get<EventDetailResponse>(`${userEventRoutes.BASE}/${id}`),

  getGuestList: (id: number | string) =>
    backendApi.get<GuestListResponse>(
      `${userEventRoutes.BASE}/${id}/guest-list`,
    ),

  getAffiliateEvent: (id: number | string) =>
    backendApi.get<AffiliateEventDetailResponse>(
      `${userEventRoutes.AFFILIATE}/${id}`,
    ),

  getEventTicketData: (id: number | string) =>
    backendApi.get<EventTicketDataResponse>(
      `${userEventRoutes.ATTENDEES}/${id}/tickets`,
    ),
};
