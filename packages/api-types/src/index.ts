// @lemonade/api-types
//
// GENERATED PACKAGE — do not hand-edit anything under src/ once generation
// is wired up. This file is a placeholder describing the shape the
// generator must produce, sourced from docs/ARCHITECTURE.md §2 and §7.
//
// TODO(Phase 2): replace with output from tooling/generate-api-types, driven
// by the backend's Postman collection or an OpenAPI export.

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

// Placeholder — the real 18-case union comes from App\Enums\Shared\ErrorCode.
// TODO(Phase 2): generate from the backend enum.
export type ErrorCode =
  | "validation-failed"
  | "credentials-not-valid"
  | "account-suspended"
  | "subscription-required"
  | "plan-feature-required"
  | string;

// Placeholder — the real TokenType abilities gate routes via `ability:` middleware.
// TODO(Phase 2): generate from the backend enum.
export type TokenType =
  | "access_token"
  | "refresh_token"
  | "password_reset"
  | "password_reset_verification"
  | "two_factor"
  | string;
