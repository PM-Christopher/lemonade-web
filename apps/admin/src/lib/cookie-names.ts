// Deliberately dependency-free (no `server-only`, no `next/headers`, no
// axios) so middleware.ts — which runs on the Edge runtime — can import just
// the cookie name without pulling in the axios-based server-api.ts module,
// which Edge can't run.
export const ADMIN_TOKEN_COOKIE = "lemonade_admin_token";
export const ADMIN_REFRESH_COOKIE = "lemonade_admin_refresh";
