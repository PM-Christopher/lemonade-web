// Endpoint layer for the events domain (covers both event.slice.ts and
// promotion.slice.ts) — see apps/frontend/src/features/events/api.ts for
// the pattern this follows.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminEventRoutes, adminPromotionRoutes } from "@lemonade/api-types";

const authHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
});

export const eventsApi = {
    getEventData: (token: string, trxType: string) => {
        const headers = authHeaders(token);
        switch (trxType) {
            case "affiliates":
                return axiosInstance.get(adminEventRoutes.AFFILIATES, { headers });
            case "promotions":
                return axiosInstance.get(adminEventRoutes.PROMOTIONS_QUEUE, { headers });
            case "events":
            default:
                return axiosInstance.get(adminEventRoutes.BASE, { headers });
        }
    },

    getEventDetail: (token: string, id: number) =>
        axiosInstance.get(`${adminEventRoutes.BASE}/${id}`, { headers: authHeaders(token) }),

    eventAction: (token: string, id: number, actionType: string) => {
        const headers = authHeaders(token);
        switch (actionType) {
            case "activate":
                return axiosInstance.patch(`${adminEventRoutes.BASE}/${id}/activate-event`, {}, { headers });
            case "delete":
                return axiosInstance.delete(`${adminEventRoutes.BASE}/${id}/delete-event`, { headers });
            case "suspend":
            default:
                return axiosInstance.patch(`${adminEventRoutes.BASE}/${id}/suspend-event`, {}, { headers });
        }
    },

    updateCommissionCharge: (token: string, data: unknown) =>
        axiosInstance.patch(adminEventRoutes.UPDATE_COMMISSION_CHARGE, data, { headers: authHeaders(token) }),
};

export const promotionsApi = {
    getPromotions: (token: string) => axiosInstance.get(adminPromotionRoutes.BASE, { headers: authHeaders(token) }),

    createPromotion: (token: string, data: unknown) =>
        axiosInstance.post(adminPromotionRoutes.BASE, data, { headers: authHeaders(token) }),

    getPromotion: (token: string, id: unknown) =>
        axiosInstance.get(`${adminPromotionRoutes.BASE}/${id}`, { headers: authHeaders(token) }),

    updatePromotion: (token: string, id: unknown, data: unknown) =>
        axiosInstance.patch(`${adminPromotionRoutes.BASE}/${id}`, data, { headers: authHeaders(token) }),

    deletePromotion: (token: string, id: number) =>
        axiosInstance.delete(`${adminPromotionRoutes.BASE}/${id}`, { headers: authHeaders(token) }),
};
