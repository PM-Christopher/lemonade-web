// Endpoint layer for the exports domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminAccountRoutes } from "@lemonade/api-types";

const authHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
});

// Was calling /admin/export — fixed to the real route while migrating, see
// the comment on adminAccountRoutes in @lemonade/api-types.
export const exportsApi = {
    getCSV: (token: string, table: string) =>
        axiosInstance.get(`${adminAccountRoutes.EXPORT}?table=${table}&type=csv`, { headers: authHeaders(token) }),
};
