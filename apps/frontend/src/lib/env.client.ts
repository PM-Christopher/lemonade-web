// Validated NEXT_PUBLIC_* env vars — safe to import from client components.
// Each var below is referenced by its full literal name so Next's build-time
// inliner can still replace `process.env.NEXT_PUBLIC_X` per reference; do
// not refactor this into a loop or dynamic lookup, or the values will be
// undefined in the client bundle.
//
// Parses (and throws with a clear message) at import time rather than at
// each call site — see docs/ARCHITECTURE.md Phase 1.
import { z } from "zod";

const emptyStringAsUndefined = (value: unknown) => (value === "" ? undefined : value);

const clientEnvSchema = z.object({
  // Used to build absolute links sent to the backend (payment/OAuth
  // redirect URLs, share links) — see e.g. boost-business/page.tsx,
  // ShareTribeModal.tsx.
  NEXT_PUBLIC_APP_URL: z.string().url(),
  // The BFF's own base URL — see config/url.ts.
  NEXT_PUBLIC_BASE_URL: z.string().url(),

  // OTP resend countdown (verify-code/verify-email). Both already had a
  // `|| 60` / `|| "otp_timer_start"` fallback at each call site — kept
  // optional here for the same reason.
  NEXT_PUBLIC_COUNTDOWN_DURATION: z.preprocess(
    emptyStringAsUndefined,
    z.coerce.number().int().positive().optional(),
  ),
  NEXT_PUBLIC_COUNTDOWN_STORAGE_KEY: z.preprocess(emptyStringAsUndefined, z.string().optional()),

  // Google OAuth login. Not set in this app's own .env.local today — the
  // login page's GoogleOAuthProvider already assumes it's present (a
  // pre-existing gap, not introduced here); optional so a missing value
  // doesn't crash env parsing itself, only that one flow.
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.preprocess(emptyStringAsUndefined, z.string().optional()),

  // Pusher (chat/notifications realtime). Empty string in .env.local today.
  NEXT_PUBLIC_PUSHER_KEY: z.preprocess(emptyStringAsUndefined, z.string().optional()),

  // Firebase (push notifications). None of these are set locally —
  // src/lib/firebase.ts and FcmContext.tsx already guard on `messaging`
  // being falsy, so the feature degrades rather than crashing.
  NEXT_PUBLIC_FIREBASE_API_KEY: z.preprocess(emptyStringAsUndefined, z.string().optional()),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.preprocess(emptyStringAsUndefined, z.string().optional()),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.preprocess(emptyStringAsUndefined, z.string().optional()),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.preprocess(emptyStringAsUndefined, z.string().optional()),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.preprocess(
    emptyStringAsUndefined,
    z.string().optional(),
  ),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.preprocess(emptyStringAsUndefined, z.string().optional()),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.preprocess(emptyStringAsUndefined, z.string().optional()),
  NEXT_PUBLIC_FIREBASE_VAPID_KEY: z.preprocess(emptyStringAsUndefined, z.string().optional()),
});

const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_COUNTDOWN_DURATION: process.env.NEXT_PUBLIC_COUNTDOWN_DURATION,
  NEXT_PUBLIC_COUNTDOWN_STORAGE_KEY: process.env.NEXT_PUBLIC_COUNTDOWN_STORAGE_KEY,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
});

if (!parsed.success) {
  throw new Error(
    `Invalid client environment variables:\n${JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)}`,
  );
}

export const clientEnv = parsed.data;
