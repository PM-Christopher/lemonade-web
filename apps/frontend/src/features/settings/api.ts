// Endpoint layer for the settings/profile domain — see features/events/api.ts
// for the pattern this follows. Still on the pre-BFF axiosInstance transport
// deliberately (Phase 5 concern, not this refactor).
import { axiosInstance } from "@/lib/axiosInstane";
import { userSettingsRoutes, sharedUtilityRoutes } from "@lemonade/api-types";

export const settingsApi = {
    getUserProfile: (token: string) =>
        axiosInstance.get(userSettingsRoutes.PROFILE, { headers: { Authorization: `Bearer ${token}` } }),

    requestPayout: (data: unknown) => axiosInstance.post(userSettingsRoutes.REQUEST_PAYOUT, data),

    createBankAccount: (formData: unknown, config: { headers: Record<string, string> }) =>
        axiosInstance.post(userSettingsRoutes.BANK_ACCOUNT_CREATE, formData, config),

    upload: (formData: unknown, config: Record<string, unknown>) => axiosInstance.post(sharedUtilityRoutes.UPLOAD, formData, config),
};
