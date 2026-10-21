// Endpoints for the job disputes domain over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminBusinessesRoutes, buildPath } from "@lemonade/api-types/generated";

export interface DisputeParty {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string | null;
}

export type DisputeStatus = "pending" | "refunded" | "released";
export type DisputeResolution = "refund" | "release";

export interface AdminDispute {
  id: string;
  status: DisputeStatus;
  dispute: string;
  attachments: string[];
  date_raised: string;
  // Hours since it was raised.
  age_hours: number;
  // Open for longer than the response time.
  overdue: boolean;
  assignee: { id: string; name: string } | null;
  assigned_at: string | null;
  raised_by: DisputeParty | null;
  raised_by_role: "client" | "owner";
  job: {
    id: string;
    amount_minor: number;
    // Server-formatted major units, e.g. "1,000.00".
    amount: string;
    status: string;
    services: string[];
    additional_info: string | null;
    remark: string | null;
    escrow_status: string | null;
    business: { id: string; name: string; image: string | null } | null;
    client: DisputeParty | null;
    owner: DisputeParty | null;
  } | null;
}

export interface DisputeSummary {
  open: number;
  overdue: number;
  unassigned: number;
  mine: number;
  overdue_after_hours: number;
}

export interface DisputeFilters {
  // `me`, `unassigned` or an admin id.
  assignee?: string;
  overdue?: boolean;
}

export interface DisputeListResponse {
  summary: DisputeSummary;
  disputes: AdminDispute[];
}

export interface DisputeDetailResponse {
  dispute: AdminDispute;
}

export interface ResolveDisputePayload {
  resolution: DisputeResolution;
}

export const disputesApi = {
  // Omitting status fetches the open queue; pass "all" for every dispute.
  getDisputes: (status?: string, filters?: DisputeFilters) =>
    browserApi.get<DisputeListResponse>(adminBusinessesRoutes.DISPUTES_LIST, {
      params: { status, assignee: filters?.assignee, overdue: filters?.overdue ? 1 : undefined },
    }),

  // Leave `adminId` out to take it yourself; pass null to put it back in the queue.
  assignDispute: (id: string, adminId?: string | null) =>
    browserApi.patch<{ id: string; assigned_to: string | null }>(
      buildPath(adminBusinessesRoutes.DISPUTES_ASSIGN, { id }),
      adminId === undefined ? {} : { admin_id: adminId },
    ),

  getDispute: (id: string) =>
    browserApi.get<DisputeDetailResponse>(buildPath(adminBusinessesRoutes.DISPUTES_SHOW, { id })),

  resolveDispute: (id: string, payload: ResolveDisputePayload) =>
    browserApi.patch<DisputeDetailResponse & { message: string }>(
      buildPath(adminBusinessesRoutes.DISPUTES_RESOLVE, { id }),
      payload,
    ),
};
