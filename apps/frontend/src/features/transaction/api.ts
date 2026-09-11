import { axiosInstance } from "@/lib/axiosInstane";
import { userTransactionRoutes, sharedUtilityRoutes } from "@lemonade/api-types";

export const transactionApi = {
    verifyTransaction: (data: unknown) => axiosInstance.post(userTransactionRoutes.VERIFY, data),

    getBanks: () => axiosInstance.get(sharedUtilityRoutes.GET_ALL_BANKS),
};
