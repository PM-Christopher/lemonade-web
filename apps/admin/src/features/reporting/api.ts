// Endpoint layer for the reporting domain — see
// apps/frontend/src/features/events/api.ts for the pattern this follows.
//
// resolveReport's pre-migration call passed `{ headers }` as the request
// BODY (axios's 2nd arg), not the config (3rd arg), so the Authorization
// header it tried to build was never actually sent. That's resolved now,
// as a side effect of the httpOnly-cookie cutover (this transport attaches
// auth automatically, server-side — there's no header left for a caller to
// misplace). markCompleted takes no request body on the backend either
// (see lemonade-backend's ReportController::markCompleted), so the plain,
// argument-free PATCH below is correct, not a placeholder. Live-verified:
// PATCH through the BFF proxy with a real admin session flips a report's
// status to "completed"; the same call with no session correctly 401s.
import { axiosInstance } from "@/lib/axiosInstane";
import { adminReportRoutes } from "@lemonade/api-types";

export const reportingApi = {
    getReportData: () => axiosInstance.get(adminReportRoutes.BASE),

    getReportDetail: (id: number) => axiosInstance.get(`${adminReportRoutes.BASE}/${id}`),

    resolveReport: (id: number) => axiosInstance.patch(`${adminReportRoutes.BASE}/${id}`),

    deleteReportContent: (id: number, data: unknown) =>
        axiosInstance.patch(`${adminReportRoutes.BASE}/${id}/delete-content`, data),
};
