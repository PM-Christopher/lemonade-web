// Endpoint layer for the events domain — one typed function per route,
// calling the transport with a named constant instead of a path literal.
// Owns request shape (headers, params, the occasional dynamic-segment
// concatenation); owns no React, no Redux, no caching policy — see
// docs/ARCHITECTURE.md §11's "Endpoints" row. Still on the pre-BFF
// axiosInstance transport deliberately: this only cleans up how routes are
// referenced, it doesn't move the transport migration up from Phase 5.
import { axiosInstance } from "@/lib/axiosInstane";
import { userEventRoutes } from "@lemonade/api-types";

export const eventsApi = {
    buyTicket: (eventId: number, data: unknown) =>
        axiosInstance.post(`${userEventRoutes.ATTENDEES}/${eventId}/assign-tickets`, data),

    createEvent: (data: unknown) => axiosInstance.post(userEventRoutes.CREATE, data),

    editEvent: (id: number, data: unknown) => axiosInstance.put(`${userEventRoutes.UPDATE}/${id}`, data),

    publishEvent: (id: number) => axiosInstance.patch(`${userEventRoutes.PUBLISH}/${id}`),

    getEvents: () => axiosInstance.get(userEventRoutes.ATTENDEES),

    getEvent: (id: number, options: { signal?: AbortSignal }) =>
        axiosInstance.get(`${userEventRoutes.BASE}/${id}`, {
            signal: options.signal,
            params: { _ts: Date.now() },
            headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        }),

    searchEvent: (data: unknown) =>
        axiosInstance.post(userEventRoutes.SEARCH, data, {
            headers: { "Content-Type": "application/json", Accept: "application/json" },
        }),

    getPaymentSetting: () => axiosInstance.get(userEventRoutes.GET_PAYMENT_SETTING),

    updatePaymentSetting: (data: unknown) =>
        axiosInstance.patch(userEventRoutes.UPDATE_PAYMENT_SETTING, data),

    filterEvent: (
        data: { category: string; period: string; start_date: string; end_date: string; location: string },
    ) =>
        axiosInstance.get(
            `${userEventRoutes.FILTER}?category=${data.category}&period=${data.period}&start_date=${data.start_date}&end_date=${data.end_date}&location=${data.location}`,
        ),

    getOrganizerEvents: () => axiosInstance.get(userEventRoutes.BASE),

    getAffiliateEvents: () => axiosInstance.get(`${userEventRoutes.AFFILIATE}`),

    getAffiliateData: () => axiosInstance.get(`${userEventRoutes.AFFILIATE}/data`),

    getEventTicketData: (id: number) => axiosInstance.get(`${userEventRoutes.ATTENDEES}/${id}/tickets`),

    getGuestList: (id: number) => axiosInstance.get(`${userEventRoutes.BASE}/${id}/guest-list`),

    getGuestListDetails: (id: number, guestId: number | null) =>
        axiosInstance.get(`${userEventRoutes.BASE}/${id}/${guestId}/guest-details`),

    checkInGuest: (id: number, guestId: number | null) =>
        axiosInstance.patch(`${userEventRoutes.BASE}/${id}/${guestId}/check-in`),

    getPromotions: () => axiosInstance.get(userEventRoutes.PROMOTIONS),

    payForPromotion: (id: number, data: unknown) => axiosInstance.post(`${userEventRoutes.BASE}/${id}/promote-event`, data),

    getEventPromotion: (id: number, promotionId: number) =>
        axiosInstance.get(`${userEventRoutes.BASE}/${id}/${promotionId}/event-promotion`),

    getEventTickets: (id: number) => axiosInstance.get(`${userEventRoutes.BASE}/${id}/event-tickets`),

    editEventTickets: (id: number, data: unknown) => axiosInstance.patch(`${userEventRoutes.BASE}/${id}/edit-tickets`, data),

    getProgram: (id: number) => axiosInstance.get(`${userEventRoutes.AFFILIATE}/${id}`),

    generateAffiliateLink: (id: number) => axiosInstance.post(`${userEventRoutes.AFFILIATE}/${id}/generate-link`),

    searchAffiliateEvent: (data: unknown) => axiosInstance.post(userEventRoutes.SEARCH_AFFILIATE_EVENTS, data),

    guestSearch: (id: number, q: unknown, signal?: AbortSignal) =>
        axiosInstance.post(`${userEventRoutes.BASE}/${id}/search-guest-list`, null, { params: { q }, signal }),
};
