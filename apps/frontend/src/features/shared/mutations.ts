import { useMutation } from "@tanstack/react-query";
import { sharedApi } from "./api";

export function useVerifyAccountMutation() {
  return useMutation({
    mutationFn: ({ bankCode, accountNumber }: { bankCode: string; accountNumber: string }) =>
      sharedApi.verifyAccount(bankCode, accountNumber),
  });
}
