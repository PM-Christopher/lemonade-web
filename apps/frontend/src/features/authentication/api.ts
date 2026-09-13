// Endpoint layer for the auth/session domain — the first domain migrated
// to TanStack Query (see queries.ts/mutations.ts), proving the pattern
// docs/ARCHITECTURE.md §11 lays out before the other ~18 domains migrate
// off Redux thunks. Two transports, deliberately:
//   - login/logout call this app's OWN Next.js Route Handlers
//     (/api/auth/login, /api/auth/logout) directly — those aren't under
//     the /v1 BFF proxy prefix, they ARE the broker that talks to the
//     backend and sets the httpOnly cookie server-side.
//   - getCurrentUser calls the real backend through browserApi (the BFF
//     proxy), same as every other authenticated read.
import { browserApi } from "@/lib/browser-api";
import { userSettingsRoutes } from "@lemonade/api-types";

export interface CurrentUser {
    id: string | number;
    email: string;
    fullname: string;
    username: string | null;
    [key: string]: unknown;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResult {
    user: CurrentUser;
    needsOnboarding?: boolean;
    token?: string; // only present when needsOnboarding — see app/api/auth/login/route.ts
}

async function postJson<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const envelope = await response.json();

    if (!response.ok) {
        throw Object.assign(new Error(envelope?.message ?? "Request failed"), {
            status: response.status,
            errorCode: envelope?.error_code,
            fieldErrors: envelope?.errors,
        });
    }

    return envelope.data as T;
}

export const authApi = {
    login: (payload: LoginPayload) => postJson<LoginResult>("/api/auth/login", payload),
    logout: () => postJson<void>("/api/auth/logout"),
    getCurrentUser: () => browserApi.get<CurrentUser>(userSettingsRoutes.PROFILE),
};
