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
  // The BFF's own base URL — see config/url.ts.
  NEXT_PUBLIC_BASE_URL: z.string().url(),

  // Pusher (moderation/withdrawal realtime updates). Empty string in
  // .env.local today.
  NEXT_PUBLIC_PUSHER_KEY: z.preprocess(emptyStringAsUndefined, z.string().optional()),
});

const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
});

if (!parsed.success) {
  throw new Error(
    `Invalid client environment variables:\n${JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)}`,
  );
}

export const clientEnv = parsed.data;
