import axios from "axios";

// Points at this app's own BFF proxy (same-origin, /api/v1/*), not Laravel
// directly — the httpOnly session cookie rides along automatically on any
// same-origin request, so no token is ever read or attached here. See
// src/app/api/v1/[...path]/route.ts and src/lib/server-api.ts. Every
// domain's api.ts still builds an Authorization header from a
// Redux-stored `token` argument (leftover from before this cutover) —
// harmless: the proxy ignores it and always injects the real one
// server-side. Removing that dead parameter everywhere is separate,
// larger follow-up work.
export const axiosInstance = axios.create({
    baseURL: "/api/v1",
    headers: { "Content-Type": "application/json" },
});

function clearLegacyCookies() {
    ["token"].forEach((name) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
}

// Refresh-on-401 is handled server-side, inside the BFF proxy's own
// backendApi instance (see src/lib/server-api.ts's `refresh` config). A
// 401 here means that already happened and failed.
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearLegacyCookies();
            if (typeof window !== "undefined") window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);
