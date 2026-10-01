// Endpoint layer for the businesses domain — see features/team/api.ts for
// the pattern this follows: the BFF proxy transport (browserApi), not the
// pre-BFF axiosInstance.
//
// Contract verified against lemonade-backend directly (not guessed):
// app/Http/Controllers/Api/V1/Admin/BusinessController.php,
// app/Http/Resources/Admin/AdminBusinessResource.php,
// app/Actions/Business/*.php, app/Enums/Shared/BusinessStatusEnum.php.
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
  name: string;
  image: string | null;
  description: string;
  categories: string[];
  services: string[];
  service_rate: number | null;
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
}

export interface BusinessDetailResponse {
  business: AdminBusiness;
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
  getBusinesses: (status?: string) =>
    browserApi.get<BusinessListResponse>(adminBusinessesRoutes.LIST, {
      params: status ? { status } : undefined,
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

  deleteBusiness: (id: string) =>
    browserApi.delete<{ deleted: boolean }>(buildPath(adminBusinessesRoutes.DELETE, { id })),
};
