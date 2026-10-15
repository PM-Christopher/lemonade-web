import { useMutation } from "@tanstack/react-query";
import { transactionApi, type VerifyTransactionPayload } from "./api";

// Confirms a Paystack redirect's trxref. A one-shot call, so a mutation, not a query.
export function useVerifyTransactionMutation<TData = unknown>() {
  return useMutation({
    mutationFn: (data: VerifyTransactionPayload) => transactionApi.verifyTransaction<TData>(data),
  });
}
