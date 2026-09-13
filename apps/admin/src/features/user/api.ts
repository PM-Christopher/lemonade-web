// Endpoint layer for the user domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
//
// NOTE (found, not fixed — preserving exact current behavior per this
// migration's own rule): getAccountInfo's "business" case calls the same
// user-logs endpoint as "activities-log" does. Looks like unfinished
// routing logic, not a path-string bug; reproduced as-is.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminUserRoutes } from "@lemonade/api-types";

export const userApi = {
    getUserData: (trxType: string) => {
        switch (trxType) {
            case "affiliates":
                return axiosInstance.get(adminUserRoutes.AFFILIATES_LOG);
            case "users":
            default:
                return axiosInstance.get(adminUserRoutes.BASE);
        }
    },

    getUserDetail: (id: number) => axiosInstance.get(`${adminUserRoutes.BASE}/${id}`),

    getAffiliateDetail: (id: number) => axiosInstance.get(`${adminUserRoutes.AFFILIATES_DETAIL}/${id}/detail`),

    // See the NOTE above for the "business" case.
    getAccountInfo: (id: number, infoType: string) => {
        switch (infoType) {
            case "tribes":
                return axiosInstance.get(`${adminUserRoutes.BASE}/${id}/user-tribes`);
            case "events":
                return axiosInstance.get(`${adminUserRoutes.BASE}/${id}/user-events`);
            case "wallet":
                return axiosInstance.get(`${adminUserRoutes.BASE}/${id}/user-wallet`);
            case "activities-log":
            case "business":
            default:
                return axiosInstance.get(`${adminUserRoutes.BASE}/${id}/user-logs`);
        }
    },

    userAction: (id: number, actionType: string) => {
        switch (actionType) {
            case "deactivate":
                return axiosInstance.patch(`${adminUserRoutes.BASE}/${id}/deactivate-user`, {});
            case "reactivate":
                return axiosInstance.patch(`${adminUserRoutes.BASE}/${id}/reactivate-user`, {});
            case "suspend":
            default:
                return axiosInstance.patch(`${adminUserRoutes.BASE}/${id}/suspend-user`, {});
        }
    },
};
