// Endpoint layer for the transaction domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
//
// NOTE (found, not fixed — preserving exact current behavior per this
// migration's own rule): getTransactionData's "boosting", "services" and
// "promotions" cases all call the same plan-subscription endpoint as
// "plan-subscriptions" does, even though the backend has dedicated
// /admin/transaction/{boosts,services,promotions} routes (see
// adminTransactionRoutes below — BOOSTS/SERVICES/PROMOTIONS are defined but
// unused here). Looks like unfinished routing logic, not a path-string bug;
// reproduced as-is.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminTransactionRoutes } from "@lemonade/api-types";

const authHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
});

export const transactionApi = {
    getPlanSubscriptions: (token: string) =>
        axiosInstance.get(`${adminTransactionRoutes.PLAN_SUBSCRIPTION}/`, { headers: authHeaders(token) }),

    getPlanSubscription: (token: string, id: number) =>
        axiosInstance.get(`${adminTransactionRoutes.PLAN_SUBSCRIPTION}/${id}`, { headers: authHeaders(token) }),

    getWalletWithdrawal: (token: string, id: number) =>
        axiosInstance.get(`${adminTransactionRoutes.WALLET_WITHDRAWAL}/${id}`, { headers: authHeaders(token) }),

    getEventDetail: (token: string, id: number) =>
        axiosInstance.get(`${adminTransactionRoutes.EVENT}/${id}`, { headers: authHeaders(token) }),

    // See the NOTE above for the boosting/services/promotions fallthrough.
    getTransactionData: (token: string, trxType: string) => {
        const headers = authHeaders(token);
        switch (trxType) {
            case "plan-subscriptions":
                return axiosInstance.get(adminTransactionRoutes.PLAN_SUBSCRIPTION, { headers });
            case "wallet-withdrawals":
                return axiosInstance.get(adminTransactionRoutes.WALLET_WITHDRAWALS, { headers });
            case "boosting":
                return axiosInstance.get(adminTransactionRoutes.PLAN_SUBSCRIPTION, { headers });
            case "services":
                return axiosInstance.get(adminTransactionRoutes.PLAN_SUBSCRIPTION, { headers });
            case "events":
                return axiosInstance.get(adminTransactionRoutes.EVENTS, { headers });
            case "promotions":
                return axiosInstance.get(adminTransactionRoutes.PLAN_SUBSCRIPTION, { headers });
            default:
                return undefined;
        }
    },
};
