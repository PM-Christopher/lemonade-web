// Endpoints for the business domain over the BFF transport (browserApi).
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

/** A boost's schedule, as the backend's BusinessBoostResource returns it. */
export interface BusinessBoostSchedule {
  full_start_date: string;
  full_end_date: string;
  start_date: string;
  start_time: string;
  duration: number | null;
}

/** A service request job, as the backend's ServiceRequestJobResource returns it. */
export interface ServiceRequestJob {
  id: string;
  business: {
    id: string;
    name: string;
    image: string | null;
    user_id: string;
    city: string;
    country: string;
    service_rate: number | null;
  } | null;
  user: { id: string; fullname: string; username: string; profile_image: string | null } | null;
  owner_id: string;
  amount: number;
  services: string[];
  additional_info: string | null;
  remark: string | null;
  status: string;
  payment_requested: boolean;
  payment_made: boolean;
  refunded: boolean;
  is_owner: boolean;
  created_at: string;
}

export interface VerifyJobPaymentResponse {
  verified: boolean;
  paid_at: string | null;
  job: ServiceRequestJob;
}

export interface VerifyBoostPaymentResponse {
  verified: boolean;
  boost: BusinessBoostSchedule;
}

export interface JobsDataResponse {
  count: {
    in_progress: number;
    completed: number;
    sent_offers: number;
    revenue: number;
  };
  in_progress: ServiceRequestJob[];
  completed: ServiceRequestJob[];
  sent_offers: ServiceRequestJob[];
}

export interface RequestServiceResponse {
  message: string;
}

export interface GetJobResponse {
  job: ServiceRequestJob;
}

// Empty values are ignored by the backend. Budget is in naira.
export interface BusinessFilterParams {
  search?: string;
  location?: string;
  category?: string;
  service_type?: string;
  start_range?: string;
  end_range?: string;
}

export interface FilterBusinessResponse {
  businesses: BusinessInterface[];
}

export interface MarkJobRequestResponse {
  message: string;
}

export interface RequestJobPaymentResponse {
  message: string;
  job: ServiceRequestJob;
}

export interface MakeJobPaymentResponse {
  payment: string;
  reference: string;
}

export interface MarkJobCompletedResponse {
  message: string;
  job: ServiceRequestJob;
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

export interface BusinessReview {
  user: { id: number; username: string; avatar: string };
  title: string;
  description: string;
  rating: number;
  created_at: string;
}

export interface BusinessReviewsResponse {
  reviews: BusinessReview[];
  subReviews: Array<{ rating: number; count: number }>;
  average_rating: number;
}

export interface ReviewPayload {
  rating: number;
  title: string;
  description: string;
}

export const businessApi = {
  // Confirm a Paystack checkout after the redirect back to the app.
  verifyJobPayment: (reference: string) =>
    browserApi.post<VerifyJobPaymentResponse>(userBusinessRoutes.JOBS_VERIFY_PAYMENT, {
      reference,
    }),

  verifyBoostPayment: (reference: string) =>
    browserApi.post<VerifyBoostPaymentResponse>(userBusinessRoutes.VERIFY_BOOST_PAYMENT, {
      reference,
    }),

  getBusinessReviews: (id: number | string) =>
    browserApi.get<BusinessReviewsResponse>(buildPath(userBusinessRoutes.REVIEWS, { id })),

  getListings: () => browserApi.get<ListingsResponse>(userListingRoutes.LIST),

  createListing: (values: CreateOrUpdateBusinessPayload) =>
    browserApi.post<BusinessDetailResponse>(userListingRoutes.CREATE, values),

  updateListing: (id: number | string, values: CreateOrUpdateBusinessPayload) =>
    browserApi.patch<BusinessDetailResponse>(buildPath(userListingRoutes.UPDATE, { id }), values),

  deleteListing: (id: number | string) =>
    browserApi.delete<{ deleted: boolean }>(buildPath(userListingRoutes.DELETE, { id })),

  writeBusinessReview: (id: number | string, data: ReviewPayload) =>
    browserApi.post<unknown>(buildPath(userBusinessRoutes.WRITE_REVIEW, { id }), data),

  reviewJob: (id: string, data: ReviewPayload) =>
    browserApi.post<{ message: string }>(buildPath(userBusinessRoutes.JOBS_REVIEW, { id }), data),

  boostListing: (id: number | string, data: BoostBusinessPayload) =>
    browserApi.post<BoostBusinessResponse>(buildPath(userListingRoutes.BOOST, { id }), data),

  getJobsData: () => browserApi.get<JobsDataResponse>(userBusinessRoutes.JOBS_LIST),

  // Same shape as getJobsData, scoped to one owned business listing.
  getBusinessJobData: (id: number | string) =>
    browserApi.get<JobsDataResponse>(buildPath(userListingRoutes.JOB_DATA, { id })),

  getBoostPackages: () => browserApi.get<BoostPackagesResponse>(userListingRoutes.BOOSTS),

  getBusinesses: () => browserApi.get<BusinessListResponse>(userBusinessRoutes.LIST),

  getBusiness: (id: number | string) =>
    browserApi.get<BusinessDetailResponse>(buildPath(userBusinessRoutes.SHOW, { id })),

  requestService: (id: number | string, data: unknown) =>
    browserApi.post<RequestServiceResponse>(
      buildPath(userBusinessRoutes.REQUEST_SERVICE, { id }),
      data,
    ),

  // A job is viewed either as the requester ("business") or as the listing owner ("listing").
  getJob: (type: string, id: string) =>
    browserApi.get<GetJobResponse>(
      buildPath(type === "listing" ? userListingRoutes.JOBS_SHOW : userBusinessRoutes.JOBS_SHOW, {
        id,
      }),
    ),

  filterBusiness: (value: BusinessFilterParams) =>
    browserApi.get<FilterBusinessResponse>(userBusinessRoutes.FILTER, {
      params: value,
    }),

  markJobRequest: (id: string, data: unknown) =>
    browserApi.post<MarkJobRequestResponse>(buildPath(userListingRoutes.JOBS_MARK, { id }), data),

  requestJobPayment: (id: string) =>
    browserApi.patch<RequestJobPaymentResponse>(
      buildPath(userListingRoutes.JOBS_REQUEST_PAYMENT, { id }),
    ),

  makeJobPayment: (id: string, data: unknown) =>
    browserApi.post<MakeJobPaymentResponse>(buildPath(userBusinessRoutes.JOBS_PAY, { id }), data),

  markJobCompleted: (id: string) =>
    browserApi.post<MarkJobCompletedResponse>(
      buildPath(userBusinessRoutes.JOBS_MARK_COMPLETED, { id }),
    ),

  disputeJob: (id: string, data: unknown) =>
    browserApi.post<DisputeJobResponse>(buildPath(userBusinessRoutes.JOBS_DISPUTE, { id }), data),
};
