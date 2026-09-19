// @lemonade/api-types
//
// GENERATED PACKAGE — do not hand-edit anything under src/ once generation
// is wired up. This file is a placeholder describing the shape the
// generator must produce, sourced from docs/ARCHITECTURE.md §2 and §7.
//
// TODO(Phase 2): replace with output from tooling/generate-api-types, driven
// by the backend's Postman collection or an OpenAPI export.
//
// Until then, the two enums below are hand-mirrored from the backend source
// of truth (lemonade-backend, checked directly, not guessed):
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

export * from "./routes";
export * from "./build-path";
