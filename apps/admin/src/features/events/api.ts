// Endpoint layer for the events domain (covers both event.slice.ts and
// promotion.slice.ts) — see apps/frontend/src/features/events/api.ts for
// the pattern this follows.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminEventRoutes, adminPromotionRoutes } from "@lemonade/api-types";

export const eventsApi = {
    getEventData: (trxType: string) => {
        switch (trxType) {
            case "affiliates":
                return axiosInstance.get(adminEventRoutes.AFFILIATES);
            case "promotions":
                return axiosInstance.get(adminEventRoutes.PROMOTIONS_QUEUE);
            case "events":
            default:
                return axiosInstance.get(adminEventRoutes.BASE);
        }
    },

    getEventDetail: (id: number) => axiosInstance.get(`${adminEventRoutes.BASE}/${id}`),

    eventAction: (id: number, actionType: string) => {
        switch (actionType) {
            case "activate":
                return axiosInstance.patch(`${adminEventRoutes.BASE}/${id}/activate-event`, {});
            case "delete":
                return axiosInstance.delete(`${adminEventRoutes.BASE}/${id}/delete-event`);
            case "suspend":
            default:
                return axiosInstance.patch(`${adminEventRoutes.BASE}/${id}/suspend-event`, {});
        }
    },

    updateCommissionCharge: (data: unknown) => axiosInstance.patch(adminEventRoutes.UPDATE_COMMISSION_CHARGE, data),
};

export const promotionsApi = {
    getPromotions: () => axiosInstance.get(adminPromotionRoutes.BASE),

    createPromotion: (data: unknown) => axiosInstance.post(adminPromotionRoutes.BASE, data),

    getPromotion: (id: unknown) => axiosInstance.get(`${adminPromotionRoutes.BASE}/${id}`),

    updatePromotion: (id: unknown, data: unknown) => axiosInstance.patch(`${adminPromotionRoutes.BASE}/${id}`, data),

    deletePromotion: (id: number) => axiosInstance.delete(`${adminPromotionRoutes.BASE}/${id}`),
};
