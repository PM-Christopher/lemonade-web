// @lemonade/api-client
//
// Transport only. No endpoint functions, no React, no hooks — the moment
// this package knows what a tribe is, the boundary has been crossed.
//
// This is used SERVER-SIDE ONLY (Server Components, Route Handlers, Server
// Actions) to call lemonade-backend directly with a Bearer token read from
// an httpOnly cookie. Client Components never import this to reach Laravel
// directly — they call a same-origin BFF Route Handler (see
// apps/*/src/app/api/v1/[...path]/route.ts), which uses an instance of this
// same client to do the real call. That Route Handler is also the one place
// each app's browser-side code is allowed to reach through — see
// docs/ARCHITECTURE.md §13 for the full auth flow this implements.
//
// Both guards now have a working, tested refresh + logout implementation on
// the backend (SignInUser/SignInAdmin issue a rotating refresh token,
// RefreshAccessToken/RefreshAdminAccessToken redeem it, LogoutUser/LogoutAdmin
// revoke every token) — see lemonade-backend's
// tests/Feature/Identity/AuthRefreshAndLogoutFlowTest.php for the verified
// end-to-end flow. Admin's refresh route (POST /v1/admin/auth/refresh) is
// new — it didn't exist at all before.

import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiErrorBody, ApiSuccess, ErrorCode } from "@lemonade/api-types";
import { DEFAULT_ERROR_CODE } from "@lemonade/api-types";

export type ApiErrorKind =
  | "validation"
  | "auth"
  | "permission"
  | "notFound"
  | "conflict"
  | "rateLimit"
  | "server"
  | "network"
  | "timeout";

export interface ApiErrorInit {
  status: number;
  errorCode: ErrorCode;
  message: string;
  kind: ApiErrorKind;
  fieldErrors?: Record<string, string[]>;
  correlationId?: string;
}

/** Every failure from this package normalizes to this shape. Components branch on `kind`/`errorCode`, never on message text. */
export class ApiError extends Error {
  readonly status: number;
  readonly errorCode: ErrorCode;
  readonly kind: ApiErrorKind;
  readonly fieldErrors?: Record<string, string[]>;
  readonly correlationId?: string;

  constructor(init: ApiErrorInit) {
    super(init.message);
    this.name = "ApiError";
    this.status = init.status;
    this.errorCode = init.errorCode;
    this.kind = init.kind;
    if (init.fieldErrors !== undefined) this.fieldErrors = init.fieldErrors;
    if (init.correlationId !== undefined) this.correlationId = init.correlationId;
  }
}

export interface RefreshConfig {
  /** Path relative to baseURL, e.g. "/auth/refresh". Only exists for the user guard today. */
  refreshPath: string;
  getRefreshToken: () => string | undefined | Promise<string | undefined>;
  /** Persist the new token(s) — e.g. write the httpOnly cookie in the caller's Route Handler. `expiresIn` is seconds, from the backend's own `expires_in`. */
  onRefreshed: (accessToken: string, refreshToken?: string, expiresIn?: number) => void | Promise<void>;
}

export interface ApiClientConfig {
  baseURL: string;
  timeoutMs?: number;
  /** Read the Bearer token server-side (from the httpOnly cookie). Omit for a client with no auth concept (e.g. an unauthenticated login call). */
  getToken?: () => string | undefined | Promise<string | undefined>;
  /** Propagate an inbound X-Correlation-Id instead of minting a new one. */
  getCorrelationId?: () => string | undefined;
  /** Omit entirely where the backend exposes no refresh route (admin, today). */
  refresh?: RefreshConfig;
  /** Refresh failed, or none configured and a 401 came back anyway — clear the session. */
  onUnauthorized?: () => void | Promise<void>;
}

export interface ApiClient {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  /** Generic escape hatch for the BFF proxy, which forwards an arbitrary method/path pair. */
  request<T = unknown>(config: AxiosRequestConfig): Promise<T>;
}

function mapKind(status: number): ApiErrorKind {
  switch (status) {
    case 401:
      return "auth";
    case 403:
      return "permission";
    case 404:
      return "notFound";
    case 409:
      return "conflict";
    case 422:
      return "validation";
    case 429:
      return "rateLimit";
    default:
      return status >= 500 ? "server" : "server";
  }
}

function toApiError(error: AxiosError<ApiErrorBody>): ApiError {
  if (!error.response) {
    const timedOut = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
    return new ApiError({
      status: 0,
      errorCode: DEFAULT_ERROR_CODE,
      message: timedOut ? "Request timed out." : "Network error. Please check your connection.",
      kind: timedOut ? "timeout" : "network",
    });
  }

  const { status, data, headers } = error.response;
  const correlationId = headers?.["x-correlation-id"] as string | undefined;

  return new ApiError({
    status,
    errorCode: data?.error_code ?? DEFAULT_ERROR_CODE,
    message: data?.message || "Something went wrong.",
    kind: mapKind(status),
    ...(data?.errors ? { fieldErrors: data.errors } : {}),
    ...(correlationId ? { correlationId } : {}),
  });
}

function unwrap<T>(request: Promise<AxiosResponse<ApiSuccess<T>>>): Promise<T> {
  return request.then((response) => response.data.data as T);
}

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  const instance: AxiosInstance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeoutMs ?? 15_000,
    headers: { "Content-Type": "application/json" },
  });

  let isRefreshing = false;
  let queue: Array<{ resolve: (token: string | undefined) => void; reject: (err: unknown) => void }> = [];

  instance.interceptors.request.use(async (requestConfig) => {
    // Never trust a caller-supplied Authorization header (e.g. one forwarded
    // verbatim from an inbound browser request in the BFF proxy) — the
    // server-derived token, if any, is the only one that may go out.
    delete requestConfig.headers.Authorization;

    if (config.getToken) {
      const token = await config.getToken();
      if (token) requestConfig.headers.Authorization = `Bearer ${token}`;
    }

    const correlationId = config.getCorrelationId?.() ?? crypto.randomUUID();
    requestConfig.headers["X-Correlation-Id"] = correlationId;

    return requestConfig;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorBody>) => {
      const original = error.config as RetryableConfig | undefined;
      const status = error.response?.status;

      if (status === 401 && config.refresh && original && !original._retry) {
        original._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            queue.push({
              resolve: (token) => {
                if (token) original.headers.Authorization = `Bearer ${token}`;
                resolve(instance(original));
              },
              reject,
            });
          });
        }

        isRefreshing = true;
        try {
          const refreshToken = await config.refresh.getRefreshToken();
          if (!refreshToken) throw toApiError(error);

          // Plain axios, not `instance` — avoids recursively hitting this
          // same response interceptor on the refresh call itself.
          const { data } = await axios.post<ApiSuccess<{ token: string; refresh_token?: string; expires_in?: number }>>(
            `${config.baseURL}${config.refresh.refreshPath}`,
            { refresh_token: refreshToken },
          );

          const newAccessToken = data.data?.token;
          if (!newAccessToken) throw toApiError(error);

          await config.refresh.onRefreshed(newAccessToken, data.data?.refresh_token, data.data?.expires_in);

          queue.forEach((p) => p.resolve(newAccessToken));
          queue = [];

          original.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(original);
        } catch (refreshError) {
          queue.forEach((p) => p.reject(refreshError));
          queue = [];
          await config.onUnauthorized?.();
          return Promise.reject(refreshError instanceof ApiError ? refreshError : toApiError(error));
        } finally {
          isRefreshing = false;
        }
      }

      if (status === 401) {
        await config.onUnauthorized?.();
      }

      return Promise.reject(toApiError(error));
    },
  );

  return {
    get: (url, cfg) => unwrap(instance.get(url, cfg)),
    post: (url, data, cfg) => unwrap(instance.post(url, data, cfg)),
    patch: (url, data, cfg) => unwrap(instance.patch(url, data, cfg)),
    put: (url, data, cfg) => unwrap(instance.put(url, data, cfg)),
    delete: (url, cfg) => unwrap(instance.delete(url, cfg)),
    request: (cfg) => unwrap(instance.request(cfg)),
  };
}
