import { useAppDispatch } from "@/redux/hook";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {axiosInstance} from "@/lib/axiosInstane";
import {AxiosResponse} from "axios";

export const useRequest = (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body: any = {},
    start = true,
    headers: Record<string, string> = {} // flat object
) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const getData = async () => {
        setLoading(true);
        setError(false);
        setErrorMessage(null);

        try {
            let response;

            switch(method) {
                case "GET":
                    response = await axiosInstance.get(url, { headers: headers || {} });
                    break;
                case "POST":
                    response = await axiosInstance.post(url, body, { headers: headers || {} });
                    break;
                case "PUT":
                    response = await axiosInstance.put(url, body, { headers: headers || {} });
                    break;
                case "DELETE":
                    response = await axiosInstance.delete(url, { headers: headers || {} });
                    break;
            }

            if (response?.data?.status) {
                setData(response.data.data ?? response.data.banks ?? response.data);
            }

        } catch (err: any) {
            setError(true);
            setErrorMessage(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useLayoutEffect(() => {
        if (start) getData();
        else setLoading(false);
    }, [url]);

    return { data, loading, error, errorMessage, getData };
};

