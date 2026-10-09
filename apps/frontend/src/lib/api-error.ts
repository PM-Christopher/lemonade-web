import { ApiError } from "@lemonade/api-client";

/** Server message from an ApiError, or the fallback for anything else. */
export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError && error.message ? error.message : fallback;
}

/** Puts the server's validation messages on matching form fields; true when any landed. */
export function applyFieldErrors(
  error: unknown,
  fields: readonly string[],
  setFieldError: (field: string, message: string) => void,
): boolean {
  if (!(error instanceof ApiError) || !error.fieldErrors) return false;
  let applied = false;
  for (const field of fields) {
    const message = error.fieldErrors[field]?.[0];
    if (message) {
      setFieldError(field, message);
      applied = true;
    }
  }
  return applied;
}
