import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    businessApi,
    type BoostBusinessPayload,
    type BusinessListResponse,
    type CreateOrUpdateBusinessPayload,
} from "./api";
import { businessKeys } from "./queries";

export function useCreateListingMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: CreateOrUpdateBusinessPayload) => businessApi.createListing(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: businessKeys.listings() });
        },
    });
}

export function useUpdateListingMutation(id: number | string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: CreateOrUpdateBusinessPayload) => businessApi.updateListing(id as number, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: businessKeys.listings() });
            if (id) queryClient.invalidateQueries({ queryKey: businessKeys.detail(id) });
        },
    });
}

export function useBoostListingMutation(id: number | string | undefined) {
    return useMutation({
        mutationFn: (data: BoostBusinessPayload) => businessApi.boostListing(id as number, data),
    });
}

export function useRequestServiceMutation(id: number) {
    return useMutation({
        mutationFn: (data: unknown) => businessApi.requestService(id, data),
    });
}

// A per-click lookup triggered from JobsCard, not cacheable list/detail
// state — same pattern as admin's affiliate/event lookups this session.
export function useGetJobMutation() {
    return useMutation({
        mutationFn: ({ id, type }: { id: number; type: string }) => businessApi.getJob(type, id),
    });
}

export function useFilterBusinessMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (value: { location: string; category: string; service_type: string; start_range: string; end_range: string }) =>
            businessApi.filterBusiness(value),
        onSuccess: (result) => {
            // Filtering replaces what's shown as "businesses" — write
            // straight into the businesses query's cache rather than a
            // separate piece of state, so BusinessSection (which reads that
            // query) reflects the filtered results without extra plumbing.
            queryClient.setQueryData<BusinessListResponse>(businessKeys.businesses(), (old) => ({
                businesses: result.businesses,
                featured: old?.featured ?? [],
            }));
        },
    });
}

export function useMarkJobRequestMutation(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: unknown) => businessApi.markJobRequest(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: businessKeys.jobsData() });
        },
    });
}

export function useRequestJobPaymentMutation(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => businessApi.requestJobPayment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: businessKeys.jobsData() });
        },
    });
}

export function useMakeJobPaymentMutation(id: number) {
    return useMutation({
        mutationFn: (data: unknown) => businessApi.makeJobPayment(id, data),
    });
}

export function useMarkJobCompletedMutation(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => businessApi.markJobCompleted(id),
        onSuccess: () => {
            // Never optimistic for money/state-machine changes — the old
            // reducer manually moved the job between in_progress/completed
            // arrays client-side; this refetches the authoritative list
            // instead.
            queryClient.invalidateQueries({ queryKey: businessKeys.jobsData() });
        },
    });
}

export function useDisputeJobMutation(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: unknown) => businessApi.disputeJob(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: businessKeys.jobsData() });
        },
    });
}
