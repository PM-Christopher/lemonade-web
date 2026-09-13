// Endpoint layer for the profile domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminAccountRoutes } from "@lemonade/api-types";

// Was calling /admin/profile — fixed to the real route while migrating,
// see the comment on adminAccountRoutes in @lemonade/api-types.
export const profileApi = {
    getProfile: () => axiosInstance.get(adminAccountRoutes.PROFILE),
};
