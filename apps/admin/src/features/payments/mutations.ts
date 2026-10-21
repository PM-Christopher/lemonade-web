import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "./api";
import { paymentReviewKeys } from "./queries";

// Not optimistic: Paystack decides, so the list refetches afterwards.
export function useVerifyPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentsApi.verify(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentReviewKeys.all() });
    },
  });
}
