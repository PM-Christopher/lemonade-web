import { ApiError } from "@lemonade/api-client";

/** Server message from an ApiError, or the fallback for anything else. */
export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError && error.message ? error.message : fallback;
}
