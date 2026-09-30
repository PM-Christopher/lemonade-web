// Validated NEXT_PUBLIC_* env vars — safe to import from client components.
// Each var below is referenced by its full literal name so Next's build-time
// inliner can still replace `process.env.NEXT_PUBLIC_X` per reference; do
// not refactor this into a loop or dynamic lookup, or the values will be
// undefined in the client bundle.
//
// Parses (and throws with a clear message) at import time rather than at
// each call site — see docs/ARCHITECTURE.md Phase 1.
//
// Same checks as before, without importing Zod. Zod on this module ships
// to every page that reads config/url.ts.

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

export const clientEnv = {
  // The BFF's own base URL — see config/url.ts.
  NEXT_PUBLIC_BASE_URL: requiredUrl("NEXT_PUBLIC_BASE_URL", process.env.NEXT_PUBLIC_BASE_URL),

  // ADR-005: self-hosted Reverb, not Pusher Cloud, for moderation/withdrawal
  // realtime updates. Empty string in .env.local today.
  NEXT_PUBLIC_REVERB_KEY: blankAsUndefined(process.env.NEXT_PUBLIC_REVERB_KEY),
  NEXT_PUBLIC_REVERB_HOST: blankAsUndefined(process.env.NEXT_PUBLIC_REVERB_HOST),
  NEXT_PUBLIC_REVERB_PORT: blankAsUndefined(process.env.NEXT_PUBLIC_REVERB_PORT),
  NEXT_PUBLIC_REVERB_SCHEME: blankAsUndefined(process.env.NEXT_PUBLIC_REVERB_SCHEME),

  // Firebase (admin push notifications) — same project as the frontend
  // app's equivalent vars (src/lib/env.client.ts), since both apps read
  // notifications from the same backend. Not set locally — firebase.ts
  // already guards on `messaging` being falsy, so the feature degrades
  // rather than crashing.
  NEXT_PUBLIC_FIREBASE_API_KEY: blankAsUndefined(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  NEXT_PUBLIC_FIREBASE_APP_ID: blankAsUndefined(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: blankAsUndefined(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: blankAsUndefined(
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  ),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: blankAsUndefined(
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  ),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: blankAsUndefined(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: blankAsUndefined(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  ),
  NEXT_PUBLIC_FIREBASE_VAPID_KEY: blankAsUndefined(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY),
};
