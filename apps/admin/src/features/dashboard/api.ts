// Endpoint layer for the dashboard domain — one typed function per route,
// calling the transport with a named constant instead of a path literal.
// Still on the pre-BFF axiosInstance transport deliberately — this only
// cleans up how routes are referenced, it doesn't move the transport
// migration up from Phase 5.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminAccountRoutes } from "@lemonade/api-types";

const authHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
});

// Was calling /admin/dashboard — fixed to the real route while migrating,
// see the comment on adminAccountRoutes in @lemonade/api-types.
export const dashboardApi = {
    getMetrics: (token: string) => axiosInstance.get(adminAccountRoutes.DASHBOARD, { headers: authHeaders(token) }),
};
