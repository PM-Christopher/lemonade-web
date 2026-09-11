// Deliberately dependency-free (no `server-only`, no `next/headers`, no
// axios) so middleware.ts — which runs on the Edge runtime — can import just
// the cookie names without pulling in the axios-based server-api.ts module,
// which Edge can't run.
export const USER_TOKEN_COOKIE = "lemonade_user_token";
export const USER_REFRESH_COOKIE = "lemonade_user_refresh";
