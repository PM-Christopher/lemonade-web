import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi, type CreateBankAccountPayload, type RequestPayoutPayload } from "./api";
import { settingsKeys } from "./queries";

export function useRequestPayoutMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RequestPayoutPayload) => settingsApi.requestPayout(data),
        onSuccess: () => {
            // Never optimistic for money — invalidate and let the wallet
            // query refetch the authoritative payout status/history.
            queryClient.invalidateQueries({ queryKey: settingsKeys.wallet() });
        },
    });
}

export function useCreateBankAccountMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBankAccountPayload) => settingsApi.createBankAccount(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settingsKeys.wallet() });
        },
    });
}
