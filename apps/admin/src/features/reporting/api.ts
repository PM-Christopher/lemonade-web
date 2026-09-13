// Endpoint layer for the reporting domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
//
// NOTE (found, not fixed — preserving exact current behavior per this
// migration's own rule): resolveReport's original PATCH call passed
// `{ headers }` as the request BODY (axios's 2nd arg), not the config (3rd
// arg) — so the Authorization header was never actually sent on that one
// call. Now that the transport attaches auth automatically, that specific
// bug is moot (there's no header to misplace), but the call shape below is
// still reproduced as a plain PATCH with no body, matching what the
// pre-migration call actually sent over the wire.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminReportRoutes } from "@lemonade/api-types";

export const reportingApi = {
    getReportData: () => axiosInstance.get(adminReportRoutes.BASE),

    getReportDetail: (id: number) => axiosInstance.get(`${adminReportRoutes.BASE}/${id}`),

    resolveReport: (id: number) => axiosInstance.patch(`${adminReportRoutes.BASE}/${id}`),

    deleteReportContent: (id: number, data: unknown) =>
        axiosInstance.patch(`${adminReportRoutes.BASE}/${id}/delete-content`, data),
};
