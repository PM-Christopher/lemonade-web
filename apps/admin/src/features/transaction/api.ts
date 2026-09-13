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

export const transactionApi = {
    getPlanSubscriptions: () => axiosInstance.get(`${adminTransactionRoutes.PLAN_SUBSCRIPTION}/`),

    getPlanSubscription: (id: number) => axiosInstance.get(`${adminTransactionRoutes.PLAN_SUBSCRIPTION}/${id}`),

    getWalletWithdrawal: (id: number) => axiosInstance.get(`${adminTransactionRoutes.WALLET_WITHDRAWAL}/${id}`),

    getEventDetail: (id: number) => axiosInstance.get(`${adminTransactionRoutes.EVENT}/${id}`),

    // See the NOTE above for the boosting/services/promotions fallthrough.
    getTransactionData: (trxType: string) => {
        switch (trxType) {
            case "plan-subscriptions":
                return axiosInstance.get(adminTransactionRoutes.PLAN_SUBSCRIPTION);
            case "wallet-withdrawals":
                return axiosInstance.get(adminTransactionRoutes.WALLET_WITHDRAWALS);
            case "boosting":
                return axiosInstance.get(adminTransactionRoutes.PLAN_SUBSCRIPTION);
            case "services":
                return axiosInstance.get(adminTransactionRoutes.PLAN_SUBSCRIPTION);
            case "events":
                return axiosInstance.get(adminTransactionRoutes.EVENTS);
            case "promotions":
                return axiosInstance.get(adminTransactionRoutes.PLAN_SUBSCRIPTION);
            default:
                return undefined;
        }
    },
};
