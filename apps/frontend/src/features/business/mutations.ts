import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  businessApi,
  type BoostBusinessPayload,
  type CreateOrUpdateBusinessPayload,
  type ReviewPayload,
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
    mutationFn: (values: CreateOrUpdateBusinessPayload) =>
      businessApi.updateListing(id as number, values),
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

export function useRequestServiceMutation(id: number | string) {
  return useMutation({
    mutationFn: (data: unknown) => businessApi.requestService(id, data),
  });
}

// A per-click lookup triggered from JobsCard, not cacheable list/detail
// state — same pattern as admin's affiliate/event lookups this session.
export function useGetJobMutation() {
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: string }) => businessApi.getJob(type, id),
  });
}

export function useDeleteListingMutation(id: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => businessApi.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.listings() });
      queryClient.invalidateQueries({ queryKey: businessKeys.businesses() });
    },
  });
}

export function useWriteBusinessReviewMutation(id: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReviewPayload) => businessApi.writeBusinessReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.reviews(id) });
      queryClient.invalidateQueries({ queryKey: businessKeys.detail(id) });
    },
  });
}

export function useReviewJobMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReviewPayload) => businessApi.reviewJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.all() });
    },
  });
}

export function useMarkJobRequestMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => businessApi.markJobRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.all() });
    },
  });
}

export function useRequestJobPaymentMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => businessApi.requestJobPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.all() });
    },
  });
}

export function useMakeJobPaymentMutation(id: string) {
  return useMutation({
    mutationFn: (data: unknown) => businessApi.makeJobPayment(id, data),
  });
}

export function useMarkJobCompletedMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => businessApi.markJobCompleted(id),
    onSuccess: () => {
      // Never optimistic for money/state-machine changes — the old
      // reducer manually moved the job between in_progress/completed
      // arrays client-side; this refetches the authoritative list
      // instead.
      queryClient.invalidateQueries({ queryKey: businessKeys.all() });
    },
  });
}

export function useDisputeJobMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => businessApi.disputeJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.all() });
    },
  });
}
