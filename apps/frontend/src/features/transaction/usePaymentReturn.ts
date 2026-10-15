"use client";

import { useEffect, useEffectEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useNavigation } from "@/hooks/useNavigation";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useVerifyTransactionMutation } from "./mutations";

// Verifies a Paystack return (?trxref=), clears it from the URL, and calls onPaid only if the payment went through.
export function usePaymentReturn<TData = unknown>(onPaid: (data: TData) => void) {
  const searchParams = useSearchParams();
  const { replace } = useNavigation();
  const dispatch = useAppDispatch();
  const { mutate } = useVerifyTransactionMutation<TData>();
  const trxref = searchParams.get("trxref");

  const verify = useEffectEvent((ref: string) => {
    mutate(
      { trx_ref: ref },
      {
        onSuccess: (result) => {
          const params = new URLSearchParams(searchParams);
          params.delete("trxref");
          params.delete("reference");
          replace(`?${params.toString()}`);

          if (result.status === "successful") {
            onPaid(result.data);
          } else {
            dispatch(
              updateToastifyReducer({
                show: true,
                message: "We couldn't confirm your payment.",
                type: "error",
              }),
            );
          }
        },
        onError: (err) => {
          console.error("Payment verification failed:", err);
        },
      },
    );
  });

  useEffect(() => {
    if (trxref) verify(trxref);
  }, [trxref]);
}
