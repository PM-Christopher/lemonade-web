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
};
