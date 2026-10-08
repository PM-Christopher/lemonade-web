import { useEffect, useState, useRef } from "react";
import { transactionApi, type VerifyTransactionResponse } from "@/features/transaction/api";

/** Polls the transaction verify endpoint until `isSuccess` passes. */
export const useTransactionPolling = <TData = unknown>(
  config: null | {
    transactionId: string;
    isSuccess: (result: VerifyTransactionResponse<TData>) => boolean;
    onSuccess: (result: VerifyTransactionResponse<TData>) => void;
    pollingInterval: number;
  },
) => {
  const [data, setData] = useState<VerifyTransactionResponse<TData> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!config || !config.transactionId) return;

    const { transactionId, isSuccess, onSuccess, pollingInterval = 4000 } = config;

    const verifyTransaction = async () => {
      try {
        setLoading(true);
        const result = await transactionApi.verifyTransaction<TData>({ trx_ref: transactionId });
        setData(result);

        if (isSuccess(result)) {
          onSuccess(result);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    verifyTransaction();
    intervalRef.current = setInterval(verifyTransaction, pollingInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // Keyed on transactionId only: callers pass fresh callbacks each render, which would restart polling.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.transactionId]);

  return { data, loading };
};
