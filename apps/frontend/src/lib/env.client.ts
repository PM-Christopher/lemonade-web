// Validated NEXT_PUBLIC_* env vars — safe to import from client components.
// Each var below is referenced by its full literal name so Next's build-time
// inliner can still replace `process.env.NEXT_PUBLIC_X` per reference; do
// not refactor this into a loop or dynamic lookup, or the values will be
// undefined in the client bundle.
//
// Parses (and throws with a clear message) at import time rather than at
// each call site — see docs/ARCHITECTURE.md Phase 1.
//
// These checks used to go through Zod. Zod 4 lands in every client route
// that imports config/url.ts, which blew the /connect first-load budget.
// The rules are the same; they just don't pull the schema library into
// the browser bundle. Server env still uses Zod in env.server.ts.

function blankAsUndefined(value: string | undefined): string | undefined {
  return value === "" || value === undefined ? undefined : value;
}

function fail(name: string, message: string): never {
  throw new Error(
    `Invalid client environment variables:\n${JSON.stringify({ [name]: [message] }, null, 2)}`,
  );
}

function requiredUrl(name: string, value: string | undefined): string {
  const raw = blankAsUndefined(value);
  if (!raw) fail(name, "Invalid url");
  try {
    new URL(raw);
  } catch {
    fail(name, "Invalid url");
  }
  return raw;
}

function optionalString(value: string | undefined): string | undefined {
  return blankAsUndefined(value);
}

function optionalPositiveInt(name: string, value: string | undefined): number | undefined {
  const raw = blankAsUndefined(value);
  if (raw === undefined) return undefined;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) fail(name, "Expected a positive integer");
  return parsed;
}

export const clientEnv = {
  // Used to build absolute links sent to the backend (payment/OAuth
  // redirect URLs, share links) — see e.g. boost-business/page.tsx,
  // ShareTribeModal.tsx.
  NEXT_PUBLIC_APP_URL: requiredUrl("NEXT_PUBLIC_APP_URL", process.env.NEXT_PUBLIC_APP_URL),
  // The BFF's own base URL — see config/url.ts.
  NEXT_PUBLIC_BASE_URL: requiredUrl("NEXT_PUBLIC_BASE_URL", process.env.NEXT_PUBLIC_BASE_URL),

  // OTP resend countdown (verify-code/verify-email). Both already had a
  // `|| 60` / `|| "otp_timer_start"` fallback at each call site — kept
  // optional here for the same reason.
  NEXT_PUBLIC_COUNTDOWN_DURATION: optionalPositiveInt(
    "NEXT_PUBLIC_COUNTDOWN_DURATION",
    process.env.NEXT_PUBLIC_COUNTDOWN_DURATION,
  ),
  NEXT_PUBLIC_COUNTDOWN_STORAGE_KEY: optionalString(process.env.NEXT_PUBLIC_COUNTDOWN_STORAGE_KEY),

  // Google OAuth login. Not set in this app's own .env.local today — the
  // login page's GoogleOAuthProvider already assumes it's present (a
  // pre-existing gap, not introduced here); optional so a missing value
  // doesn't crash env parsing itself, only that one flow.
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: optionalString(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID),

  // ADR-005: self-hosted Reverb, not Pusher Cloud, for chat/notifications
  // realtime. Empty string in .env.local today.
  NEXT_PUBLIC_REVERB_KEY: optionalString(process.env.NEXT_PUBLIC_REVERB_KEY),
  NEXT_PUBLIC_REVERB_HOST: optionalString(process.env.NEXT_PUBLIC_REVERB_HOST),
  NEXT_PUBLIC_REVERB_PORT: optionalString(process.env.NEXT_PUBLIC_REVERB_PORT),
  NEXT_PUBLIC_REVERB_SCHEME: optionalString(process.env.NEXT_PUBLIC_REVERB_SCHEME),

  // Firebase (push notifications). None of these are set locally —
  // src/lib/firebase.ts and FcmContext.tsx already guard on `messaging`
  // being falsy, so the feature degrades rather than crashing.
  NEXT_PUBLIC_FIREBASE_API_KEY: optionalString(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  NEXT_PUBLIC_FIREBASE_APP_ID: optionalString(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: optionalString(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: optionalString(
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  ),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: optionalString(
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  ),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: optionalString(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: optionalString(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  ),
  NEXT_PUBLIC_FIREBASE_VAPID_KEY: optionalString(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY),
};
