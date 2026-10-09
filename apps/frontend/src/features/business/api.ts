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
  id: number;
  business: { id: number; name: string; image: string | null; user_id: number } | null;
  amount: number;
  services: unknown[];
  status: string;
  payment_made: boolean;
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

  requestService: (id: number, data: unknown) =>
    browserApi.post<RequestServiceResponse>(
      buildPath(userBusinessRoutes.REQUEST_SERVICE, { id }),
      data,
    ),

  // A job is viewed either as the requester ("business") or as the listing owner ("listing").
  getJob: (type: string, id: number) =>
    browserApi.get<GetJobResponse>(
      buildPath(type === "listing" ? userListingRoutes.JOBS_SHOW : userBusinessRoutes.JOBS_SHOW, {
        id,
      }),
    ),

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
    browserApi.post<MarkJobRequestResponse>(buildPath(userListingRoutes.JOBS_MARK, { id }), data),

  requestJobPayment: (id: number) =>
    browserApi.patch<RequestJobPaymentResponse>(
      buildPath(userListingRoutes.JOBS_REQUEST_PAYMENT, { id }),
    ),

  makeJobPayment: (id: number, data: unknown) =>
    browserApi.post<MakeJobPaymentResponse>(buildPath(userBusinessRoutes.JOBS_PAY, { id }), data),

  markJobCompleted: (id: number) =>
    browserApi.post<MarkJobCompletedResponse>(
      buildPath(userBusinessRoutes.JOBS_MARK_COMPLETED, { id }),
    ),

  disputeJob: (id: number, data: unknown) =>
    browserApi.post<DisputeJobResponse>(buildPath(userBusinessRoutes.JOBS_DISPUTE, { id }), data),
};
