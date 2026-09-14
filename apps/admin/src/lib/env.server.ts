// Validated server-only env vars — never import this from a client
// component (the `server-only` import below makes that a build error).
import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  // The backend's own base URL, read by the BFF proxy and a few Route
  // Handlers that call the backend directly (broadcasting/auth,
  // exports/csv). Never exposed to the browser — that's
  // NEXT_PUBLIC_BASE_URL's job.
  LARAVEL_API_URL: z.string().url(),
});

const parsed = serverEnvSchema.safeParse({
  LARAVEL_API_URL: process.env.LARAVEL_API_URL,
});

if (!parsed.success) {
  throw new Error(
    `Invalid server environment variables:\n${JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)}`,
  );
}

export const serverEnv = parsed.data;
