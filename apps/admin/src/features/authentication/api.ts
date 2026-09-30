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
  role: string | null;
  // Every permission this admin holds via any role, e.g. "wallet.write" —
  // see docs/ARCHITECTURE.md §22 Conflict 2. Section-level UI gating reads
  // from this list, never from a hardcoded role-name map.
  permissions: string[];
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

// Mirrors backend's RegisterAdminDeviceTokenRequest (app/Http/Requests/
// Notification/RegisterAdminDeviceTokenRequest.php): device_token
// required, device_type/platform nullable strings.
export interface RegisterDeviceTokenPayload {
  device_token: string;
  device_type?: string | null;
  platform?: string | null;
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
  // GetAdminProfile::execute() (lemonade-backend) returns ['admin' => new
  // AdminResource($admin)] — the envelope is { admin: {...} }, not the admin
  // flat. Pre-existing: this was already wrong for `email`/`name` before the
  // permissions field existed, just never visibly broke anything since
  // nothing critical read those fields through this path — surfaced now
  // because sidebar/route gating actually depends on `permissions` resolving.
  getCurrentAdmin: () =>
    browserApi.get<{ admin: CurrentAdmin }>(adminAccountRoutes.PROFILE).then((r) => r.admin),

  // The real endpoint for handing the browser's FCM token to the backend
  // (app/Actions/Notification/RegisterAdminDeviceToken.php). See
  // FcmContext.tsx's FcmProvider for when this is actually called.
  registerDeviceToken: (data: RegisterDeviceTokenPayload) =>
    browserApi.post<{ device_token: unknown }>(adminAccountRoutes.DEVICE_TOKEN, data),
};
