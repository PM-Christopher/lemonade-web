// @lemonade/api-client
//
// Transport only. No endpoint functions, no React, no hooks — the moment
// this package knows what a tribe is, the boundary has been crossed.
// See docs/ARCHITECTURE.md §7 and §11 for the full contract this must meet:
//
//   - base URL resolution (per-guard: auth:user vs auth:admin)
//   - envelope unwrapping ({ success, message, data? } -> T, once, here)
//   - error normalization into the typed ApiError below
//   - auth attachment (server-side, from the httpOnly cookie — see §13)
//   - refresh-once-then-fail with request coalescing, keyed on 401 not 403
//   - timeouts on every request
//   - correlation-id propagation (the backend's CorrelationId middleware)
//
// TODO(Phase 4): implement once the BFF auth flow (§13) lands.

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

export interface ApiError {
  status: number;
  errorCode: string; // ErrorCode from @lemonade/api-types once generated
  message: string;
  fieldErrors?: Record<string, string[]>;
  correlationId?: string;
  kind: ApiErrorKind;
}
