// Endpoint layer for the reporting domain — see features/dashboard/api.ts
// for the pattern this follows: the BFF proxy transport (browserApi), not
// the pre-BFF axiosInstance.
//
// markCompleted takes no request body on the backend (see
// lemonade-backend's ReportController::markCompleted) — the argument-free
// PATCH below is correct, not a placeholder.
import { browserApi } from "@/lib/browser-api";
import { adminReportsRoutes, buildPath } from "@lemonade/api-types/generated";

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
  // Not a string despite the name — the backend stores the reported model
  // itself here (Report::create(['content' => $thread, ...]) in
  // lemonade-backend's ReportTribeThread), so this is an arbitrary,
  // report-category-dependent object, same as `meta`.
  content: unknown;
  meta: unknown;
}

export interface ReportDetailResponse {
  report: ReportDetail;
}

export const reportingApi = {
  // page omitted -> old unpaginated shape (docs/ARCHITECTURE.md §22 Conflict 1).
  getReportData: (pagination?: { page?: number; perPage?: number }) =>
    browserApi.get<ReportListResponse>(adminReportsRoutes.LIST, {
      params: pagination?.page
        ? { page: pagination.page, per_page: pagination.perPage }
        : undefined,
    }),

  getReportDetail: (id: string | number) =>
    browserApi.get<ReportDetailResponse>(buildPath(adminReportsRoutes.SHOW, { id })),

  resolveReport: (id: string | number) =>
    browserApi.patch<{ completed: boolean }>(buildPath(adminReportsRoutes.MARK_COMPLETED, { id })),

  deleteReportContent: (id: string | number, data: unknown) =>
    browserApi.patch(buildPath(adminReportsRoutes.DELETE_CONTENT, { id }), data),
};
