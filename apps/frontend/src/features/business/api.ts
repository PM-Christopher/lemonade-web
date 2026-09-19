// Endpoint layer for the business domain — see features/connect/api.ts for
// the pattern this follows: the BFF proxy transport (browserApi), not the
// pre-BFF axiosInstance.
//
// NOTE: getListing/GetBusinessListing had zero real frontend consumers
// (dead code, dropped here rather than migrated) — confirmed via grep, same
// as this migration's rule throughout the session. Also out of scope:
// business-categories, business-reviews (shared-utility/business-detail
// reads still on the legacy useRequest hook, not wired to this slice at
// all) and the business/listing verify-payment flows (raw axiosInstance
// calls, not wired to this slice either) — tracked as follow-ups, not
// migrated in this pass. listing/boosts was migrated below (Phase 6
// follow-up) since boost-business/page.tsx needed it on TanStack Query to
// become a Server Component candidate.
//
// Job objects (getJob/jobsData/markJobRequest/etc.) are intentionally typed
// loosely (unknown) rather than modeled field-by-field: comparing
// ServiceRequestJobResource (backend) against what the job-related
// components actually read turned up several real mismatches
// (`is_owner` vs `job.isOwner`, `additional_info` vs
// `job.additional_information`, `business.city`/`business.country` vs
// `job.city`/`job.country` read directly on the job) — not something a
// transport migration should silently paper over by guessing which side is
// "right". See docs/ARCHITECTURE.md's Phase 5 status for the full note.
import { browserApi } from "@/lib/browser-api";
import { userBusinessRoutes, userListingRoutes, buildPath } from "@lemonade/api-types/generated";
import type { BusinessInterface } from "@/interfaces/BusinessInterface";

export interface BusinessListResponse {
  businesses: BusinessInterface[];
  featured: BusinessInterface[];
}

export interface BusinessDetailResponse {
  business: BusinessInterface;
}

export interface ListingsResponse {
  listings: BusinessInterface[];
}

export interface CreateOrUpdateBusinessPayload {
  name: string;
  image: string;
  categories: string[];
  description: string;
  city: string;
  country: string;
  services: string[];
  service_rate?: number | null;
  gallery: string[];
  email: string;
  phone_number: string;
  website_url: string;
}

export interface BoostBusinessPayload {
  package: string;
  option: string;
  start_date: string;
  start_time: string;
  callback_url: string;
}

export interface BoostBusinessResponse {
  payment: string;
}

export interface JobsDataResponse {
  count: {
    in_progress: number;
    completed: number;
    sent_offers: number;
    revenue: number;
  };
  in_progress: unknown[];
  completed: unknown[];
  sent_offers: unknown[];
}

export interface RequestServiceResponse {
  message: string;
}

export interface GetJobResponse {
  job: unknown;
}

export interface FilterBusinessResponse {
  businesses: BusinessInterface[];
}

export interface MarkJobRequestResponse {
  message: string;
}

export interface RequestJobPaymentResponse {
  message: string;
  job: unknown;
}

export interface MakeJobPaymentResponse {
  payment: string;
  reference: string;
}

export interface MarkJobCompletedResponse {
  message: string;
  job: unknown;
}

export interface DisputeJobResponse {
  message: string;
}

export interface BoostPackageOption {
  duration: number;
  price: number;
}

export interface BoostPackage {
  id: string;
  title: string;
  description: string;
  packages: BoostPackageOption[];
  status: string;
}

export interface BoostPackagesResponse {
  packages: BoostPackage[];
}

export const businessApi = {
  getListings: () =>
    browserApi.get<ListingsResponse>(userListingRoutes.LIST),

  createListing: (values: CreateOrUpdateBusinessPayload) =>
    browserApi.post<BusinessDetailResponse>(userListingRoutes.CREATE, values),

  updateListing: (id: number | string, values: CreateOrUpdateBusinessPayload) =>
    browserApi.patch<BusinessDetailResponse>(
      buildPath(userListingRoutes.UPDATE, { id }),
      values,
    ),

  boostListing: (id: number | string, data: BoostBusinessPayload) =>
    browserApi.post<BoostBusinessResponse>(
      buildPath(userListingRoutes.BOOST, { id }),
      data,
    ),

  getJobsData: () =>
    browserApi.get<JobsDataResponse>(userBusinessRoutes.JOBS_LIST),

  // Same shape as getJobsData, scoped to one owned business listing.
  getBusinessJobData: (id: number | string) =>
    browserApi.get<JobsDataResponse>(
      buildPath(userListingRoutes.JOB_DATA, { id }),
    ),

  getBoostPackages: () =>
    browserApi.get<BoostPackagesResponse>(userListingRoutes.BOOSTS),

  getBusinesses: () =>
    browserApi.get<BusinessListResponse>(userBusinessRoutes.LIST),

  getBusiness: (id: number | string) =>
    browserApi.get<BusinessDetailResponse>(buildPath(userBusinessRoutes.SHOW, { id })),

  requestService: (id: number, data: unknown) =>
    browserApi.post<RequestServiceResponse>(
      buildPath(userBusinessRoutes.REQUEST_SERVICE, { id }),
      data,
    ),

  // `type` is always "business" or "listing" — a real dynamic path
  // segment, not a suffix on a fixed prefix, so it isn't threaded through
  // a named constant the way the rest of this file is.
  getJob: (type: string, id: number) =>
    browserApi.get<GetJobResponse>(`/user/${type}/jobs/job/${id}`),

  filterBusiness: (value: {
    location: string;
    category: string;
    service_type: string;
    start_range: string;
    end_range: string;
  }) =>
    browserApi.get<FilterBusinessResponse>(userBusinessRoutes.FILTER, {
      params: value,
    }),

  markJobRequest: (id: number, data: unknown) =>
    browserApi.post<MarkJobRequestResponse>(
      buildPath(userListingRoutes.JOBS_MARK, { id }),
      data,
    ),

  requestJobPayment: (id: number) =>
    browserApi.patch<RequestJobPaymentResponse>(
      buildPath(userListingRoutes.JOBS_REQUEST_PAYMENT, { id }),
    ),

  makeJobPayment: (id: number, data: unknown) =>
    browserApi.post<MakeJobPaymentResponse>(
      buildPath(userBusinessRoutes.JOBS_PAY, { id }),
      data,
    ),

  markJobCompleted: (id: number) =>
    browserApi.post<MarkJobCompletedResponse>(
      buildPath(userBusinessRoutes.JOBS_MARK_COMPLETED, { id }),
    ),

  disputeJob: (id: number, data: unknown) =>
    browserApi.post<DisputeJobResponse>(
      buildPath(userBusinessRoutes.JOBS_DISPUTE, { id }),
      data,
    ),
};
