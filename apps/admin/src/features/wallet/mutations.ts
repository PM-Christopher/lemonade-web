import { useMutation, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "./api";
import { walletKeys } from "./queries";

// Money mutations — never optimistic (docs/ARCHITECTURE.md's staleness
// table). Every one of these invalidates and lets the next read be
// authoritative, rather than guessing the new balance/status client-side.

export function useUpdateWithdrawalThresholdMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (threshold: number) => walletApi.updateWithdrawalThreshold(threshold),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: walletKeys.data() });
        },
    });
}

export function useWithdrawalRequestDecisionMutation(id: number | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (type: "approve" | "reject") => walletApi.withdrawalRequestDecision(id, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: walletKeys.withdrawalRequests() });
            queryClient.invalidateQueries({ queryKey: walletKeys.data() });
            if (id) queryClient.invalidateQueries({ queryKey: walletKeys.detail(id) });
        },
    });
}

export function useAddToWalletMutation(id: number | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (amount: number) => walletApi.addToWallet(id, amount),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: walletKeys.data() });
            if (id) queryClient.invalidateQueries({ queryKey: walletKeys.detail(id) });
        },
    });
}

export function useDeductFromWalletMutation(id: number | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (amount: number) => walletApi.deductFromWallet(id, amount),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: walletKeys.data() });
            if (id) queryClient.invalidateQueries({ queryKey: walletKeys.detail(id) });
        },
    });
}
