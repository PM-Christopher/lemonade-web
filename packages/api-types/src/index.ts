// @lemonade/api-types
//
// Route constants and request-body types are generated — see ./generated
// (import from "@lemonade/api-types/generated", not this file) and
// tooling/generate-api-types/README.md. Every feature domain in both apps
// migrated off this package's old hand-maintained routes.ts in Phase 2
// (docs/ARCHITECTURE.md §21); that file is gone now.
//
// What's still hand-written here: the envelope types and the two enums
// below, mirrored from the backend source of truth (lemonade-backend,
// checked directly, not guessed) since response *shapes* aren't
// introspected yet (only request-side FormRequest rules are — see the
// generator's own README for why):
//   app/Enums/Shared/ErrorCode.php  — 18 cases
//   app/Enums/Shared/TokenType.php  — 10 cases

/** The backend's success envelope. `data` is omitted entirely when null. */
export interface ApiSuccess<T> {
  success: true;
  message: string;
  data?: T;
}

/** The backend's error envelope. */
export interface ApiErrorBody {
  success: false;
  message: string;
  error_code: ErrorCode;
  errors?: Record<string, string[]>;
}

/** Mirrors App\Enums\Shared\ErrorCode (backend, 18 cases). */
export type ErrorCode =
  | "validation-failed"
  | "credentials-not-valid"
  | "no-account"
  | "unauthorized"
  | "account-suspended"
  | "account-inactive"
  | "email-not-verified"
  | "social-auth-failed"
  | "rate-limit-exceeded"
  | "same-old-password"
  | "generation-failed"
  | "vpn-service-unavailable"
  | "not-found"
  | "not-specified"
  | "server-error"
  | "plan-feature-required"
  | "subscription-required"
  | "stripe-error";

/** The error code the backend defaults to when none is specified. */
export const DEFAULT_ERROR_CODE: ErrorCode = "not-specified";

/** Mirrors App\Enums\Shared\TokenType (backend, 10 cases) — gates routes via `ability:` middleware. */
export type TokenType =
  | "access_token"
  | "refresh_token"
  | "account_verification_token"
  | "email_verification"
  | "password_reset_verification"
  | "password_reset"
  | "password_reset_confirmed"
  | "account_deletion_verification"
  | "account_deletion"
  | "two_factor";

export * from "./build-path";
