import { loginPathFor, safeRedirectPath } from "@lemonade/domain";
import { routes } from "@/lib/routes";

// Pages a visitor should never be sent back to after signing in.
export const AUTH_PAGES = [
  routes.LOGIN,
  routes.SIGNUP,
  routes.FORGOT_PASSWORD,
  routes.RESET_PASSWORD,
  routes.VERIFY_EMAIL,
  routes.VERIFY_CODE,
  routes.PROFILE_SETUP,
] as const;

// Holds the destination while a new account finishes verifying and setting up.
const NEXT_COOKIE = "lemonade_next";
const NEXT_COOKIE_SECONDS = 6 * 60 * 60;

/** The page to open after signing in. Anything that could lead off this site gives home. */
export function readNext(raw: string | null | undefined): string {
  return safeRedirectPath(raw, routes.HOME, AUTH_PAGES);
}

/** Login address that brings the visitor back to `returnTo` afterwards. */
export function loginPathWithNext(returnTo: string): string {
  return loginPathFor(routes.LOGIN, returnTo, AUTH_PAGES);
}

/** Keeps the destination through email verification and profile setup. */
export function rememberNext(raw: string | null | undefined): void {
  if (typeof document === "undefined") return;
  const next = readNext(raw);
  if (next === routes.HOME) return;
  document.cookie = `${NEXT_COOKIE}=${encodeURIComponent(next)}; path=/; max-age=${NEXT_COOKIE_SECONDS}; samesite=lax`;
}

/** The remembered destination, once. Checked again here, so a tampered cookie cannot redirect anywhere. */
export function takeRememberedNext(): string {
  if (typeof document === "undefined") return routes.HOME;
  const entry = document.cookie
    .split(";")
    .find((part) => part.trim().startsWith(`${NEXT_COOKIE}=`));
  document.cookie = `${NEXT_COOKIE}=; path=/; max-age=0; samesite=lax`;
  if (!entry) return routes.HOME;
  try {
    return readNext(decodeURIComponent(entry.trim().slice(NEXT_COOKIE.length + 1)));
  } catch {
    return routes.HOME;
  }
}

/** Adds the destination to a login or signup link, when there is one. */
export function withNext(href: string, raw: string | null | undefined): string {
  const next = readNext(raw);
  return next === routes.HOME ? href : `${href}?next=${encodeURIComponent(next)}`;
}
