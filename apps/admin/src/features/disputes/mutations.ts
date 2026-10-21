import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disputesApi, type ResolveDisputePayload } from "./api";
import { disputeKeys } from "./queries";

// Settling a dispute moves money, so nothing is optimistic: refetch after success.
export function useResolveDisputeMutation(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ResolveDisputePayload) =>
      disputesApi.resolveDispute(id as string, payload),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: disputeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: disputeKeys.lists() });
    },
  });
}

// Taking or releasing a dispute reloads the queue so the counts stay true.
export function useAssignDisputeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, adminId }: { id: string; adminId?: string | null }) =>
      disputesApi.assignDispute(id, adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.all() });
    },
  });
}
