import { useEffect, useState } from "react";
import { useLatest } from "@/hooks/useLatest";
import { transactionApi, type VerifyTransactionResponse } from "@/features/transaction/api";

/** Polls the transaction verify endpoint until `isSuccess` passes, one request at a time. */
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
  const transactionId = config?.transactionId;
  const pollingInterval = config?.pollingInterval ?? 4000;

  const latestConfig = useLatest(config);

  useEffect(() => {
    if (!transactionId) return;

    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      setLoading(true);
      try {
        const result = await transactionApi.verifyTransaction<TData>({ trx_ref: transactionId });
        if (stopped) return;
        setData(result);
        const current = latestConfig.current;
        if (current?.isSuccess(result)) {
          stopped = true;
          current.onSuccess(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
      if (!stopped) timer = setTimeout(poll, pollingInterval);
    };
    poll();

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [transactionId, pollingInterval, latestConfig]);

  return { data, loading };
};
