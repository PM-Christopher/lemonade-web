// Endpoints for cross-cutting /shared/utilities/* routes.
import { browserApi } from "@/lib/browser-api";
import { sharedUtilitiesRoutes } from "@lemonade/api-types/generated";

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

export interface UploadMultipleFilesResponse {
  images: string[];
}

// Uploads can be large, so they get more time than the default request timeout.
const UPLOAD_CONFIG = { headers: { "Content-Type": "multipart/form-data" }, timeout: 60_000 };

export interface BusinessCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface EventCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface EventCategoriesResponse {
  categories: EventCategory[];
}

export interface BusinessCategoriesResponse {
  categories: BusinessCategory[];
}

export const sharedApi = {
  getBanks: () => browserApi.get<GetAllBanksResponse>(sharedUtilitiesRoutes.ALL_BANKS),

  getEventCategories: () =>
    browserApi.get<EventCategoriesResponse>(sharedUtilitiesRoutes.EVENT_CATEGORIES),

  getBusinessCategories: () =>
    browserApi.get<BusinessCategoriesResponse>(sharedUtilitiesRoutes.BUSINESS_CATEGORIES),

  verifyAccount: (bankCode: string, accountNumber: string) =>
    browserApi.post<VerifyAccountResponse>(sharedUtilitiesRoutes.VERIFY_ACCOUNT, {
      bank_code: bankCode,
      account_number: accountNumber,
    }),

  uploadFile: (formData: FormData) =>
    browserApi.post<UploadFileResponse>(sharedUtilitiesRoutes.UPLOAD, formData, UPLOAD_CONFIG),

  uploadMultipleFiles: (formData: FormData) =>
    browserApi.post<UploadMultipleFilesResponse>(
      sharedUtilitiesRoutes.UPLOAD_MULTIPLE,
      formData,
      UPLOAD_CONFIG,
    ),
};
