// Endpoints for the businesses domain over the BFF transport (browserApi).
import { browserApi } from "@/lib/browser-api";
import { adminBusinessesRoutes, buildPath } from "@lemonade/api-types/generated";

export interface BusinessOwner {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string | null;
}

// Matches BusinessStatusEnum's case names 1:1 — AdminBusinessResource
// serializes `$this['status']->name`, not the enum's int value.
export type BusinessStatus = "INACTIVE" | "ACTIVE" | "PENDING" | "REJECTED" | "SUSPENDED";

export interface AdminBusiness {
  id: string;
  unique_id: string;
  name: string;
  image: string | null;
  description: string;
  categories: string[];
  services: string[];
  service_rate: number | null;
  // Server-formatted naira.
  service_rate_naira: string | null;
  city: string;
  country: string;
  email: string;
  phone_number: string;
  website_url: string | null;
  gallery: string[];
  status: BusinessStatus;
  rejection_reason: string | null;
  reviewed_at: string | null;
  date_submitted: string;
  owner?: BusinessOwner;
}

export interface BusinessListResponse {
  businesses: AdminBusiness[];
  // The standard percent kept from a service payout.
  commission_percentage?: number;
}

export interface BusinessFilters {
  status?: string;
  from?: string;
  to?: string;
  search?: string;
}

export interface ServiceJobRow {
  id: string;
  unique_id: string;
  business: {
    id: string;
    name: string;
    image: string | null;
    city: string;
    country: string;
  } | null;
  client: { id: string; name: string } | null;
  // Server-formatted naira.
  amount: string;
  services: string[];
  status: "In-progress" | "Completed" | "In-dispute";
  start_date: string;
}

export interface BusinessSummary {
  service_revenue: string;
  services_completed: number;
  services_in_progress: number;
  services_disputed: number;
  bank: { account_number: string; account_name: string; bank_name: string } | null;
}

export interface BusinessDetailResponse {
  business: AdminBusiness & { rating?: number; boosted?: boolean };
  summary?: BusinessSummary;
  in_progress_jobs?: ServiceJobRow[];
  completed_jobs?: ServiceJobRow[];
}

export interface ServiceListResponse {
  amount_in_escrow: string;
  services_in_progress: number;
  services_completed: number;
  services_in_dispute: number;
  services: ServiceJobRow[];
}

export interface ServicePerson {
  id: string;
  name: string;
  image: string | null;
}

export interface ServiceDetailResponse {
  service: Omit<ServiceJobRow, "client"> & {
    owner: ServicePerson | null;
    client: ServicePerson | null;
    client_note: string | null;
    client_status: string | null;
    business_status: string | null;
    escrow: { status: string; amount: string } | null;
    can_settle: boolean;
    owner_bank: { account_name: string; bank_name: string; account_number: string } | null;
  };
  disputes: Array<{
    id: string;
    raised_by_role: "client" | "owner";
    remark: string;
    attachments: string[];
    status: string;
    date: string;
  }>;
}

// Mirrors RejectSubmissionRequest's `reason` rule (required string,
// 3-1000 chars) — used by both reject and suspend, which share that
// FormRequest on the backend.
export interface RejectOrSuspendPayload {
  reason: string;
}

export const businessesApi = {
  // Omitting status fetches the default "pending" review queue
  // (ListBusinessApplications::resolveStatus's default); pass "all" for
  // every listing regardless of status.
  getBusinesses: (filters?: BusinessFilters) =>
    browserApi.get<BusinessListResponse>(adminBusinessesRoutes.LIST, { params: filters }),

  getServices: (filters?: BusinessFilters) =>
    browserApi.get<ServiceListResponse>(adminBusinessesRoutes.SERVICES_LIST, { params: filters }),

  getService: (id: string) =>
    browserApi.get<ServiceDetailResponse>(buildPath(adminBusinessesRoutes.SERVICES_SHOW, { id })),

  // `release` pays the business owner, `refund` returns the money to the client.
  settleService: (id: string, resolution: "release" | "refund") =>
    browserApi.patch<{ message: string }>(
      buildPath(adminBusinessesRoutes.SERVICES_SETTLE, { id }),
      {
        resolution,
      },
    ),

  updateCommission: (commission_percentage: number) =>
    browserApi.patch<{ commission_percentage: number }>(adminBusinessesRoutes.COMMISSION, {
      commission_percentage,
    }),

  getBusinessDetail: (id: string) =>
    browserApi.get<BusinessDetailResponse>(buildPath(adminBusinessesRoutes.SHOW, { id })),

  approveBusiness: (id: string) =>
    browserApi.patch<BusinessDetailResponse>(buildPath(adminBusinessesRoutes.APPROVE, { id }), {}),

  rejectBusiness: (id: string, payload: RejectOrSuspendPayload) =>
    browserApi.patch<BusinessDetailResponse>(
      buildPath(adminBusinessesRoutes.REJECT, { id }),
      payload,
    ),

  suspendBusiness: (id: string, payload: RejectOrSuspendPayload) =>
    browserApi.patch<BusinessDetailResponse>(
      buildPath(adminBusinessesRoutes.SUSPEND, { id }),
      payload,
    ),

  reactivateBusiness: (id: string) =>
    browserApi.patch<BusinessDetailResponse>(
      buildPath(adminBusinessesRoutes.REACTIVATE, { id }),
      {},
    ),

  deleteBusiness: (id: string, reason?: string) =>
    browserApi.delete<{ deleted: boolean }>(buildPath(adminBusinessesRoutes.DELETE, { id }), {
      data: reason ? { reason } : undefined,
    }),
};
