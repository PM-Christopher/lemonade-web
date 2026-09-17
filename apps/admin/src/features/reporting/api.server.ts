import "server-only";
import { backendApi } from "@/lib/server-api";
import { adminReportRoutes } from "@lemonade/api-types";
import type { ReportListResponse, ReportDetailResponse } from "./api";

export const reportingServerApi = {
  getReportData: () =>
    backendApi.get<ReportListResponse>(adminReportRoutes.BASE),

  getReportDetail: (id: number | string) =>
    backendApi.get<ReportDetailResponse>(`${adminReportRoutes.BASE}/${id}`),
};
