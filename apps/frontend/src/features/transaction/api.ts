// Endpoint layer for the transaction domain — see features/settings/api.ts
// for the pattern this follows: the BFF proxy transport (browserApi), not
// the pre-BFF axiosInstance.
//
// NOTE: getBanks used to live here too, hitting the exact same
// /shared/utilities/get-all-banks endpoint features/shared/api.ts's
// getBanks already covers — removed as a duplicate rather than migrated a
// second time; both remaining consumers (components/settings/Modal/
// BankAccountModal.tsx, components/events/Modals/BankAccountModal.tsx) now
// use features/shared/queries.ts's useBanksQuery.
import { browserApi } from "@/lib/browser-api";
import { userTransactionRoutes } from "@lemonade/api-types";

export interface VerifyTransactionPayload {
    trx_ref: string;
}

export interface VerifyTransactionResponse {
    status: "successful" | "unsuccessful";
    // Transaction.meta is a generic JSON column whose shape depends on what
    // was purchased (event ticket, tribe membership, promotion, ...) — not
    // narrowed further here, matching how existing consumers already read
    // it defensively (event?.data?.event?.event_name, etc).
    data: unknown;
}

export const transactionApi = {
    verifyTransaction: (data: VerifyTransactionPayload) =>
        browserApi.post<VerifyTransactionResponse>(userTransactionRoutes.VERIFY, data),
};
