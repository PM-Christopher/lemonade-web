// Deliberately dependency-free (no `server-only`, no `next/headers`, no
// axios) so middleware.ts — which runs on the Edge runtime — can import just
// the cookie names without pulling in the axios-based server-api.ts module,
// which Edge can't run.
export const USER_TOKEN_COOKIE = "lemonade_user_token";
export const USER_REFRESH_COOKIE = "lemonade_user_refresh";

// Short-lived, ability-scoped Sanctum token (account_verification /
// password_reset_verification / password_reset — never the main "access"
// ability) issued mid-signup, before any real session exists. Set as a
// plain JS-readable cookie by app/(auth)/{signup,login,forgot-password}
// pages — deliberately out of scope for the httpOnly cutover (see
// features/authentication/mutations.ts). The BFF proxy reads it as a
// fallback bearer token for exactly this reason: see
// app/api/v1/[...path]/route.ts.
export const ONBOARDING_TOKEN_COOKIE = "newToken";
