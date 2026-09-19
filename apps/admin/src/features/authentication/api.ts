// Endpoint layer for the auth/session domain — mirrors
// apps/frontend/src/features/authentication/api.ts. Two transports,
// deliberately: login/logout call this app's OWN Next.js Route Handlers
// (/api/auth/login, /api/auth/logout) directly, which broker the httpOnly
// cookie server-side; getCurrentUser calls the real backend through
// browserApi (the BFF proxy), same as every other authenticated read.
import { browserApi } from "@/lib/browser-api";
import { adminAccountRoutes } from "@lemonade/api-types/generated";

export interface CurrentAdmin {
  id: string | number;
  email: string;
  name: string;
  [key: string]: unknown;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  admin: CurrentAdmin;
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
  getCurrentAdmin: () => browserApi.get<CurrentAdmin>(adminAccountRoutes.PROFILE),
};
