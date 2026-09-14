import { useMutation } from "@tanstack/react-query";
import { transactionApi, type VerifyTransactionPayload } from "./api";

// Not a cacheable read — this is a one-shot "confirm what Paystack's
// redirect just told us" call triggered by a trxref query param, same
// pattern as admin's exports domain. A mutation, not a query.
export function useVerifyTransactionMutation() {
    return useMutation({
        mutationFn: (data: VerifyTransactionPayload) => transactionApi.verifyTransaction(data),
    });
}
