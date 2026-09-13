// Endpoint layer for the wallet domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminWalletRoutes, adminTransactionRoutes } from "@lemonade/api-types";

export const walletApi = {
    getWalletData: () => axiosInstance.get(adminWalletRoutes.BASE),

    getWithdrawalRequests: () => axiosInstance.get(adminTransactionRoutes.WALLET_WITHDRAWALS),

    getWalletDetail: (id: number) => axiosInstance.get(`${adminTransactionRoutes.WALLET_WITHDRAWAL}/${id}`),

    updateWithdrawalThreshold: (threshold: number) =>
        axiosInstance.patch(adminWalletRoutes.UPDATE_WITHDRAWAL_THRESHOLD, { threshold }),

    withdrawalRequestDecision: (id: unknown, type: string) =>
        axiosInstance.patch(`${adminWalletRoutes.USER}/${id}/withdrawal-request`, { type }),

    addToWallet: (id: unknown, amount: string) => axiosInstance.patch(`${adminWalletRoutes.USER}/${id}/add`, { amount }),

    deductFromWallet: (id: unknown, amount: string) =>
        axiosInstance.patch(`${adminWalletRoutes.USER}/${id}/deduct`, { amount }),
};
