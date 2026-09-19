import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminReportsRoutes, buildPath } from "@lemonade/api-types/generated";
import type { ReportListResponse, ReportDetailResponse } from "./api";

export const reportingServerApi = {
  getReportData: (pagination?: { page?: number; perPage?: number }) =>
    backendApi.get<ReportListResponse>(adminReportsRoutes.LIST, {
      params: pagination?.page
        ? { page: pagination.page, per_page: pagination.perPage }
        : undefined,
    }),

  getReportDetail: (id: number | string) =>
    backendApi.get<ReportDetailResponse>(buildPath(adminReportsRoutes.SHOW, { id })),
};
