import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  settingsApi,
  type CreateBankAccountPayload,
  type SupportMessagePayload,
  type RequestPayoutPayload,
  type RedeemPointsPayload,
} from "./api";
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
      queryClient.invalidateQueries({ queryKey: settingsKeys.bankAccount() });
    },
  });
}

export function useRedeemPointsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RedeemPointsPayload) => settingsApi.redeemPoints(data),
    onSuccess: () => {
      // Never optimistic for money — invalidate and let the wallet query refetch the
      // authoritative points balance and wallet balance.
      queryClient.invalidateQueries({ queryKey: settingsKeys.wallet() });
    },
  });
}

export function useSendSupportMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SupportMessagePayload) => settingsApi.sendSupportMessage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.support() });
    },
  });
}

// Uploads every picked file at once and returns their addresses in the same order.
export function useUploadSupportMediaMutation() {
  return useMutation({
    mutationFn: (files: File[]) =>
      Promise.all(files.map((file) => settingsApi.uploadSupportMedia(file))),
  });
}
