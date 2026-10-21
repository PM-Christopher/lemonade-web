// Endpoints for the admin audit log over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminAuditLogRoutes } from "@lemonade/api-types/generated";

export interface AuditLogEntry {
  id: string;
  message: string;
  area: string | null;
  // The id of the record the action was about.
  subject_id: string | null;
  method: string | null;
  ip: string | null;
  // The reason, amount or other detail the admin sent.
  details: Record<string, string | number | boolean> | null;
  created_at: string;
  admin: { id: string; name: string } | null;
}

export interface AuditLogFilters {
  admin_id?: string;
  area?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
}

export interface AuditLogResponse {
  logs: AuditLogEntry[];
  admins: Array<{ id: string; name: string }>;
  areas: string[];
  meta?: { current_page: number; last_page: number; per_page: number; total: number };
}

export const auditApi = {
  getLog: (filters: AuditLogFilters) =>
    browserApi.get<AuditLogResponse>(adminAuditLogRoutes.LIST, { params: filters }),
};
