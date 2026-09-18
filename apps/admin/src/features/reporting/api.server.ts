import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminReportRoutes } from "@lemonade/api-types";
import type { ReportListResponse, ReportDetailResponse } from "./api";

export const reportingServerApi = {
  getReportData: (pagination?: { page?: number; perPage?: number }) =>
    backendApi.get<ReportListResponse>(adminReportRoutes.BASE, {
      params: pagination?.page
        ? { page: pagination.page, per_page: pagination.perPage }
        : undefined,
    }),

  getReportDetail: (id: number | string) =>
    backendApi.get<ReportDetailResponse>(`${adminReportRoutes.BASE}/${id}`),
};
