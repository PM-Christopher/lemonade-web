import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "@lemonade/api-client";

/**
 * Puts a server validation error (422) on the form fields it names.
 * Returns true when at least one landed, so the caller can skip a toast.
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
): boolean {
  if (!(error instanceof ApiError) || !error.fieldErrors) return false;

  let applied = false;
  for (const [field, messages] of Object.entries(error.fieldErrors)) {
    if ((fields as readonly string[]).includes(field) && messages[0]) {
      setError(field as Path<T>, { type: "server", message: messages[0] });
      applied = true;
    }
  }
  return applied;
}
