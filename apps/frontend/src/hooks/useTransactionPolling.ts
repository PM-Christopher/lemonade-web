import { useEffect, useState, useRef } from "react";
import {axiosInstance} from "@/lib/axiosInstane";

interface TransactionPollingProps<T = any> {
    transactionId: string|number|null;
    isSuccess: (data: any) => boolean;
    onSuccess: (data: any) => void;
    pollingInterval?: number;
}

export const useTransactionPolling = (config: null | {
    transactionId: string;
    isSuccess: (data: any) => boolean;
    onSuccess: (data: any) => void;
    pollingInterval: number
}) => {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!config || !config.transactionId) return

        let isActive = true
        const { transactionId, isSuccess, onSuccess, pollingInterval=4000 } = config

        const verifyTransaction = async () => {
            try {
                setLoading(true)
                const res = await axiosInstance.post(`/transaction/verify-transaction`, {trx_ref: transactionId})
                const resData = res?.data?.data
                setData(resData)

                if (isSuccess(resData)) {
                    if (onSuccess) onSuccess(resData)
                    if (intervalRef.current) clearInterval(intervalRef.current)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        verifyTransaction()
        intervalRef.current = setInterval(verifyTransaction, pollingInterval)

        //cleanup
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [config?.transactionId]);

    return { data, loading }
}