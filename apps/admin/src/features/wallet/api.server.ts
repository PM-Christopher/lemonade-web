import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminWalletRoutes, adminTransactionRoutes } from "@lemonade/api-types";
import type { WalletData, WithdrawalRequests, WalletDetail } from "./api";

export const walletServerApi = {
  getWalletData: () => backendApi.get<WalletData>(adminWalletRoutes.BASE),

  getWithdrawalRequests: (pagination?: { page?: number; perPage?: number }) =>
    backendApi.get<WithdrawalRequests>(adminTransactionRoutes.WALLET_WITHDRAWALS, {
      params: pagination?.page
        ? { page: pagination.page, per_page: pagination.perPage }
        : undefined,
    }),

  getWalletDetail: (id: number | string) =>
    backendApi.get<WalletDetail>(
      `${adminTransactionRoutes.WALLET_WITHDRAWAL}/${id}`,
    ),
};
