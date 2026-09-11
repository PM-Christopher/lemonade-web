// Endpoint layer for the wallet domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminWalletRoutes, adminTransactionRoutes } from "@lemonade/api-types";

const authHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
});

export const walletApi = {
    getWalletData: (token: string) => axiosInstance.get(adminWalletRoutes.BASE, { headers: authHeaders(token) }),

    getWithdrawalRequests: (token: string) =>
        axiosInstance.get(adminTransactionRoutes.WALLET_WITHDRAWALS, { headers: authHeaders(token) }),

    getWalletDetail: (token: string, id: number) =>
        axiosInstance.get(`${adminTransactionRoutes.WALLET_WITHDRAWAL}/${id}`, { headers: authHeaders(token) }),

    updateWithdrawalThreshold: (token: string, threshold: number) =>
        axiosInstance.patch(adminWalletRoutes.UPDATE_WITHDRAWAL_THRESHOLD, { threshold }, { headers: authHeaders(token) }),

    withdrawalRequestDecision: (token: string, id: unknown, type: string) =>
        axiosInstance.patch(`${adminWalletRoutes.USER}/${id}/withdrawal-request`, { type }, { headers: authHeaders(token) }),

    addToWallet: (token: string, id: unknown, amount: string) =>
        axiosInstance.patch(`${adminWalletRoutes.USER}/${id}/add`, { amount }, { headers: authHeaders(token) }),

    deductFromWallet: (token: string, id: unknown, amount: string) =>
        axiosInstance.patch(`${adminWalletRoutes.USER}/${id}/deduct`, { amount }, { headers: authHeaders(token) }),
};
