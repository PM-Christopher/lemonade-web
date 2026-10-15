// Endpoints for the reporting domain over the BFF transport (browserApi).
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

export interface ReportedEventPreview {
  event_image?: string;
  event_name?: string;
  category?: string;
  location?: string;
  event_date?: string;
  event_time?: string;
  created_at?: string;
  description?: string;
  owner?: { image?: string; fullname?: string };
}

// The reported model itself (e.g. a thread, from backend ReportTribeThread), not a string.
export interface ReportedContent {
  id?: string | number;
  events?: ReportedEventPreview | null;
}

export interface ReportDetail extends ReportRow {
  content: ReportedContent | null;
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
