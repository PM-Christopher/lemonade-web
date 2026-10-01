import { useLayoutEffect, useState } from "react";
import { axiosInstance } from "@/lib/axiosInstane";

interface LegacyAxiosError {
  response?: { data?: { message?: string } };
  message?: string;
}

export const useRequest = <T = unknown,>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: Record<string, unknown> = {},
  start = true,
  headers: Record<string, string> = {}, // flat object
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(start);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getData = async () => {
    setLoading(true);
    setError(false);
    setErrorMessage(null);

    try {
      let response;

      switch (method) {
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
    } catch (err) {
      const legacyError = err as LegacyAxiosError;
      setError(true);
      setErrorMessage(legacyError.response?.data?.message || legacyError.message || null);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (!start) return;
    const frame = window.setTimeout(() => {
      void getData();
    }, 0);
    return () => window.clearTimeout(frame);
    // getData closes over method/body/headers, which callers commonly
    // pass as fresh literals on every render (e.g. useRequest(url) with
    // the {} defaults) — this hook is deliberately designed to refetch
    // only on url change, not on every render of every caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, error, errorMessage, getData };
};
