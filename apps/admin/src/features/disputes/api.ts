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

export interface DisputeListResponse {
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
  getDisputes: (status?: string) =>
    browserApi.get<DisputeListResponse>(adminBusinessesRoutes.DISPUTES_LIST, {
      params: status ? { status } : undefined,
    }),

  getDispute: (id: string) =>
    browserApi.get<DisputeDetailResponse>(buildPath(adminBusinessesRoutes.DISPUTES_SHOW, { id })),

  resolveDispute: (id: string, payload: ResolveDisputePayload) =>
    browserApi.patch<DisputeDetailResponse & { message: string }>(
      buildPath(adminBusinessesRoutes.DISPUTES_RESOLVE, { id }),
      payload,
    ),
};
