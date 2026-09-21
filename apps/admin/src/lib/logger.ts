// Structured logging with redaction — see docs/ARCHITECTURE.md Phase 8.
// Originally server-side only (Route Handlers, middleware); also called
// from the route-segment error.tsx/global-error.tsx boundaries now — no
// Node-only APIs here, so that's safe. Emits one JSON line per call so a
// log aggregator can parse `level`/`message`/`context` without string
// parsing.
//
// Routes through console.warn/console.error only, never console.log or
// console.info — CLAUDE.md's no-console rule (`allow: ["warn", "error"]`)
// applies here same as anywhere else; "info" still carries its own `level`
// field in the JSON payload, a log aggregator reads that, not which
// console method emitted the line.

type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

// Keys redacted anywhere they appear in a context object, at any depth —
// case-insensitive, matched by exact key name so it doesn't over-redact
// unrelated fields that merely contain one of these as a substring.
const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "access_token",
  "refresh_token",
  "authorization",
  "secret",
  "otp",
  "pin",
  "card_number",
  "cvv",
  "ssn",
]);

const REDACTED = "[REDACTED]";

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        SENSITIVE_KEYS.has(key.toLowerCase()) ? REDACTED : redact(val),
      ]),
    );
  }
  return value;
}

function emit(level: LogLevel, message: string, context?: LogContext) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? { context: redact(context) } : {}),
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else {
    console.warn(line);
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => emit("info", message, context),
  warn: (message: string, context?: LogContext) => emit("warn", message, context),
  error: (message: string, context?: LogContext) => emit("error", message, context),
};
