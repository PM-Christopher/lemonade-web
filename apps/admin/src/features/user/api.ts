// Endpoint layer for the user domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
//
// NOTE (found, not fixed — preserving exact current behavior per this
// migration's own rule): getAccountInfo's "business" case calls the same
// user-logs endpoint as "activities-log" does. Looks like unfinished
// routing logic, not a path-string bug; reproduced as-is.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminUserRoutes } from "@lemonade/api-types";

const authHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
});

export const userApi = {
    getUserData: (token: string, trxType: string) => {
        const headers = authHeaders(token);
        switch (trxType) {
            case "affiliates":
                return axiosInstance.get(adminUserRoutes.AFFILIATES_LOG, { headers });
            case "users":
            default:
                return axiosInstance.get(adminUserRoutes.BASE, { headers });
        }
    },

    getUserDetail: (token: string, id: number) =>
        axiosInstance.get(`${adminUserRoutes.BASE}/${id}`, { headers: authHeaders(token) }),

    getAffiliateDetail: (token: string, id: number) =>
        axiosInstance.get(`${adminUserRoutes.AFFILIATES_DETAIL}/${id}/detail`, { headers: authHeaders(token) }),

    // See the NOTE above for the "business" case.
    getAccountInfo: (token: string, id: number, infoType: string) => {
        const headers = authHeaders(token);
        switch (infoType) {
            case "tribes":
                return axiosInstance.get(`${adminUserRoutes.BASE}/${id}/user-tribes`, { headers });
            case "events":
                return axiosInstance.get(`${adminUserRoutes.BASE}/${id}/user-events`, { headers });
            case "wallet":
                return axiosInstance.get(`${adminUserRoutes.BASE}/${id}/user-wallet`, { headers });
            case "activities-log":
            case "business":
            default:
                return axiosInstance.get(`${adminUserRoutes.BASE}/${id}/user-logs`, { headers });
        }
    },

    userAction: (token: string, id: number, actionType: string) => {
        const headers = authHeaders(token);
        switch (actionType) {
            case "deactivate":
                return axiosInstance.patch(`${adminUserRoutes.BASE}/${id}/deactivate-user`, {}, { headers });
            case "reactivate":
                return axiosInstance.patch(`${adminUserRoutes.BASE}/${id}/reactivate-user`, {}, { headers });
            case "suspend":
            default:
                return axiosInstance.patch(`${adminUserRoutes.BASE}/${id}/suspend-user`, {}, { headers });
        }
    },
};
