import { useEffect, useState, useRef } from "react";
import { axiosInstance } from "@/lib/axiosInstane";

export const useTransactionPolling = <T = unknown,>(
  config: null | {
    transactionId: string;
    isSuccess: (data: T) => boolean;
    onSuccess: (data: T) => void;
    pollingInterval: number;
  },
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!config || !config.transactionId) return;

    const { transactionId, isSuccess, onSuccess, pollingInterval = 4000 } = config;

    const verifyTransaction = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.post(`/user/transaction/verify-transaction`, {
          trx_ref: transactionId,
        });
        const resData = res?.data?.data;
        setData(resData);

        if (isSuccess(resData)) {
          if (onSuccess) onSuccess(resData);
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

    //cleanup
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // Deliberately keyed on transactionId alone: config is typically a
    // fresh object/callbacks from the caller on every render (see
    // settings/plan/page.tsx's pollingConfig), and restarting the
    // interval on every such render would re-fire verifyTransaction
    // immediately each time instead of polling on pollingInterval.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.transactionId]);

  return { data, loading };
};
