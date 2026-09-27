// Deliberately dependency-free (no `server-only`, no `next/headers`, no
// axios) so middleware.ts — which runs on the Edge runtime — can import just
// the cookie names without pulling in the axios-based server-api.ts module,
// which Edge can't run.
export const USER_TOKEN_COOKIE = "lemonade_user_token";
export const USER_REFRESH_COOKIE = "lemonade_user_refresh";

// Non-sensitive "you may have a session" indicator — never proof of
// authentication, never read for any auth/authorization decision. Backend
// sets it (App\Http\Middleware\SyncSignedInCookie, config SESSION_SIGNED_
// IN_COOKIE) on every /v1/* response once a real session exists; this app's
// server-api.ts relays it onto the browser's own response (see
// syncSignedInCookieFromHeaders). middleware.ts reads it as one more
// presence-only UX redirect signal, same trust level as USER_TOKEN_COOKIE's
// own presence check above it. Must match the backend's default exactly —
// see lemonade-backend's config/session.php.
export const SIGNED_IN_COOKIE = "lemonade-network-signed-in";

// Short-lived, ability-scoped Sanctum token (account_verification /
// password_reset_verification / password_reset — never the main "access"
// ability) issued mid-signup, before any real session exists. Set as a
// plain JS-readable cookie by app/(auth)/{signup,login,forgot-password}
// pages — deliberately out of scope for the httpOnly cutover (see
// features/authentication/mutations.ts). The BFF proxy reads it as a
// fallback bearer token for exactly this reason: see
// app/api/v1/[...path]/route.ts.
export const ONBOARDING_TOKEN_COOKIE = "newToken";
