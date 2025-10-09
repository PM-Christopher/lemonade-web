import { baseUrl } from "@/config/url";
import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

// ✅ Attach access token before every request
axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ✅ Handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            const { status } = error.response;

            // 🔑 Handle expired/invalid access token
            if (status === 403 && !originalRequest._retry) {
                originalRequest._retry = true;

                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = "Bearer " + token;
                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                isRefreshing = true;
                const refreshToken = Cookies.get("refresh_token");

                if (!refreshToken) {
                    clearAllCookies();
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                try {
                    // use plain axios to avoid recursive interceptor calls
                    const { data } = await axios.post(`${baseUrl}/auth/refresh`, {
                        refresh_token: refreshToken,
                    });

                    // API returns: { token: "newAccessToken" }
                    const token = data?.data?.token;

                    // overwrite token in cookies
                    Cookies.set("token", token, {
                        expires: 1 / 96, // ~15 minutes
                        sameSite: "Lax",
                    });

                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    processQueue(null, token);

                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    clearAllCookies();
                    window.location.href = "/login";
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // 🚫 Forbidden
            if (status === 403) {
                console.warn("403 Forbidden request – check roles/permissions");
            }
        }

        return Promise.reject(error);
    }
);

function clearAllCookies() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}
