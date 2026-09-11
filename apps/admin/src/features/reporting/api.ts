// Endpoint layer for the reporting domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
//
// NOTE (found, not fixed — preserving exact current behavior per this
// migration's own rule): resolveReport's original PATCH call passed
// `{ headers }` as the request BODY (axios's 2nd arg), not the config (3rd
// arg) — so the Authorization header was never actually sent on that one
// call. Reproduced as-is below; this needs a deliberate fix, not one that
// rides along with a path-constants refactor.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminReportRoutes } from "@lemonade/api-types";

const authHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
});

export const reportingApi = {
    getReportData: (token: string) => axiosInstance.get(adminReportRoutes.BASE, { headers: authHeaders(token) }),

    getReportDetail: (token: string, id: number) =>
        axiosInstance.get(`${adminReportRoutes.BASE}/${id}`, { headers: authHeaders(token) }),

    // See the NOTE above — `{ headers }` really is the body here, matching
    // the pre-migration call exactly.
    resolveReport: (token: string, id: number) =>
        axiosInstance.patch(`${adminReportRoutes.BASE}/${id}`, { headers: authHeaders(token) }),

    deleteReportContent: (token: string, id: number, data: unknown) =>
        axiosInstance.patch(`${adminReportRoutes.BASE}/${id}/delete-content`, data, { headers: authHeaders(token) }),
};
