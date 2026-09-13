// Endpoint layer for the exports domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminAccountRoutes } from "@lemonade/api-types";

// Was calling /admin/export — fixed to the real route while migrating, see
// the comment on adminAccountRoutes in @lemonade/api-types.
export const exportsApi = {
    getCSV: (table: string) => axiosInstance.get(`${adminAccountRoutes.EXPORT}?table=${table}&type=csv`),
};
