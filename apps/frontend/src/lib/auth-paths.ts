import { routes } from "@/lib/routes";

/** Auth and onboarding pages (no private realtime or session side effects). */
export const AUTH_PATHS = new Set<string>([
  routes.LOGIN,
  routes.SIGNUP,
  routes.FORGOT_PASSWORD,
  routes.RESET_PASSWORD,
  routes.VERIFY_EMAIL,
  routes.VERIFY_CODE,
  routes.PROFILE_SETUP,
]);

export function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.has(pathname);
}
