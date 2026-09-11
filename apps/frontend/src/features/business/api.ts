// Endpoint layer for the business domain — see features/events/api.ts for
// the pattern this follows. Still on the pre-BFF axiosInstance transport
// deliberately (Phase 5 concern, not this refactor).
import { axiosInstance } from "@/lib/axiosInstane";
import { userBusinessRoutes } from "@lemonade/api-types";

const authHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
});

export const businessApi = {
    getListings: () => axiosInstance.get(userBusinessRoutes.LISTING),

    getListing: (id: number) => axiosInstance.get(`${userBusinessRoutes.LISTING}/${id}`),

    createListing: (values: unknown, config: { headers: Record<string, string> }) =>
        axiosInstance.post(userBusinessRoutes.LISTING, values, config),

    updateListing: (id: number | string, values: unknown, config: { headers: Record<string, string> }) =>
        axiosInstance.patch(`${userBusinessRoutes.LISTING}/${id}`, values, config),

    boostListing: (id: number | string, formData: unknown, config: { headers: Record<string, string> }) =>
        axiosInstance.post(`${userBusinessRoutes.LISTING}/boost-business/${id}`, formData, config),

    getJobsData: () => axiosInstance.get(userBusinessRoutes.JOBS_ALL),

    getBusinesses: () => axiosInstance.get(userBusinessRoutes.BASE),

    getBusiness: (id: number) => axiosInstance.get(`${userBusinessRoutes.BASE}/${id}`),

    requestService: (id: number, data: unknown, token: string) =>
        axiosInstance.post(`${userBusinessRoutes.BASE}/${id}/request-service`, data, { headers: authHeaders(token) }),

    // `type` is always "business" or "listing" — a real dynamic path
    // segment, not a suffix on a fixed prefix, so it isn't threaded through
    // a named constant the way the rest of this file is.
    getJob: (type: string, id: number) => axiosInstance.get(`/user/${type}/jobs/job/${id}`),

    filterBusiness: (
        token: string,
        value: { location: string; category: string; service_type: string; start_range: string; end_range: string },
    ) =>
        axiosInstance.get(
            `${userBusinessRoutes.FILTER}?location=${value.location}&category=${value.category}&service_type=${value.service_type}&start_range=${value.start_range}&end_range=${value.end_range}`,
            { headers: authHeaders(token) },
        ),

    markJobRequest: (id: number, data: unknown) => axiosInstance.post(`${userBusinessRoutes.LISTING}/jobs/${id}/mark-job`, data),

    requestJobPayment: (id: number) => axiosInstance.patch(`${userBusinessRoutes.LISTING}/jobs/${id}/request-payment`),

    makeJobPayment: (id: number, data: unknown) => axiosInstance.post(`${userBusinessRoutes.BASE}/jobs/${id}/pay`, data),

    markJobCompleted: (id: number) => axiosInstance.post(`${userBusinessRoutes.BASE}/jobs/${id}/mark-completed`),

    disputeJob: (id: number, data: unknown) => axiosInstance.post(`${userBusinessRoutes.BASE}/jobs/${id}/dispute`, data),
};
