// Endpoint layer for the reporting domain — see features/dashboard/api.ts
// for the pattern this follows: the BFF proxy transport (browserApi), not
// the pre-BFF axiosInstance.
//
// markCompleted takes no request body on the backend (see
// lemonade-backend's ReportController::markCompleted) — the argument-free
// PATCH below is correct, not a placeholder.
import { browserApi } from "@/lib/browser-api";
import { adminReportRoutes } from "@lemonade/api-types";

export interface ReportRow {
    id: number;
    unique_id: string;
    reported_by: { name: string; image: string | null };
    category: string;
    case: string;
    date_submitted: string;
    status: string;
}

export interface ReportListResponse {
    reports: ReportRow[];
}

export interface ReportDetail extends ReportRow {
    content: string;
    meta: unknown;
}

export interface ReportDetailResponse {
    report: ReportDetail;
}

export const reportingApi = {
    getReportData: () => browserApi.get<ReportListResponse>(adminReportRoutes.BASE),

    getReportDetail: (id: number) => browserApi.get<ReportDetailResponse>(`${adminReportRoutes.BASE}/${id}`),

    resolveReport: (id: number) => browserApi.patch<{ completed: boolean }>(`${adminReportRoutes.BASE}/${id}`),

    deleteReportContent: (id: number, data: unknown) =>
        browserApi.patch(`${adminReportRoutes.BASE}/${id}/delete-content`, data),
};
