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

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ReportListResponse {
  reports: ReportRow[];
  meta?: PaginationMeta;
}

export interface ReportDetail extends ReportRow {
  content: string;
  meta: unknown;
}

export interface ReportDetailResponse {
  report: ReportDetail;
}

export const reportingApi = {
  // page omitted -> old unpaginated shape (docs/ARCHITECTURE.md §22 Conflict 1).
  getReportData: (pagination?: { page?: number; perPage?: number }) =>
    browserApi.get<ReportListResponse>(adminReportRoutes.BASE, {
      params: pagination?.page
        ? { page: pagination.page, per_page: pagination.perPage }
        : undefined,
    }),

  getReportDetail: (id: number) =>
    browserApi.get<ReportDetailResponse>(`${adminReportRoutes.BASE}/${id}`),

  resolveReport: (id: number) =>
    browserApi.patch<{ completed: boolean }>(`${adminReportRoutes.BASE}/${id}`),

  deleteReportContent: (id: number, data: unknown) =>
    browserApi.patch(`${adminReportRoutes.BASE}/${id}/delete-content`, data),
};
