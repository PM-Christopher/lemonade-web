// Endpoint layer for cross-cutting /shared/utilities/* routes — these
// don't belong to any one feature domain, so they get their own small
// service file rather than being duplicated inline at each component that
// needs an upload. See features/events/api.ts for the pattern this follows.
//
// NOTE: getBanks/verifyAccount migrated to browserApi as a byproduct of the
// settings domain migration (both settings' RequestPayoutModal/
// BankAccountModal need them) — uploadFile/uploadMultiple below are still
// on axiosInstance, not yet migrated.
import { axiosInstance } from "@/lib/axiosInstane";
import { browserApi } from "@/lib/browser-api";
import { sharedUtilityRoutes } from "@lemonade/api-types";

export interface Bank {
    id: number;
    name: string;
    slug: string;
    code: string;
}

export interface GetAllBanksResponse {
    banks: Bank[];
}

export interface VerifyAccountResponse {
    account_name: string;
}

export interface UploadFileResponse {
    image: string;
}

export const sharedApi = {
    getBanks: () => browserApi.get<GetAllBanksResponse>(sharedUtilityRoutes.GET_ALL_BANKS),

    verifyAccount: (bankCode: string, accountNumber: string) =>
        browserApi.post<VerifyAccountResponse>(sharedUtilityRoutes.VERIFY_ACCOUNT, {
            bank_code: bankCode,
            account_number: accountNumber,
        }),

    uploadFile: (formData: FormData) =>
        axiosInstance.post(sharedUtilityRoutes.UPLOAD, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    uploadMultipleFiles: (formData: FormData) =>
        axiosInstance.post(sharedUtilityRoutes.UPLOAD_MULTIPLE, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
};
