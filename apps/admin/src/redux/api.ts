// Endpoint layer for cross-cutting Redux slices under src/redux/ that
// don't belong to a single feature domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
//
// BUG FIX while migrating, not a behavior-preserving extraction: this was
// calling POST /verify-account (no /shared/utilities prefix at all — not
// reachable under any real route). Real route confirmed against the
// Postman-derived route list: POST /v1/shared/utilities/verify-account.
import { axiosInstance } from "@/lib/axiosInstane";
import { sharedUtilitiesRoutes } from "@lemonade/api-types/generated";

export const generalApi = {
  verifyAccount: (bankCode: string, accountNumber: string) =>
    axiosInstance.post(sharedUtilitiesRoutes.VERIFY_ACCOUNT, {
      bank_code: bankCode,
      account_number: accountNumber,
    }),
};
