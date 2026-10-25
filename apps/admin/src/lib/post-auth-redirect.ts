import { loginPathFor, safeRedirectPath } from "@lemonade/domain";
import { routes } from "@/lib/routes";

// Pages an admin should never be sent back to after signing in.
export const AUTH_PAGES = [
  routes.LOGIN,
  routes.FORGOT_PASSWORD,
  routes.VERIFY_CODE,
  routes.RESET_PASSWORD,
  routes.PROFILE_SETUP,
] as const;

/** The page to open after signing in. Anything that could lead off this site gives home. */
export function readNext(raw: string | null | undefined): string {
  return safeRedirectPath(raw, routes.HOME, AUTH_PAGES);
}

/** Login address that brings the admin back to `returnTo` afterwards. */
export function loginPathWithNext(returnTo: string): string {
  return loginPathFor(routes.LOGIN, returnTo, AUTH_PAGES);
}
