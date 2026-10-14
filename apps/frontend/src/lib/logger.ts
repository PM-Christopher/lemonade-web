// Structured logging with redaction — see docs/ARCHITECTURE.md Phase 8.
// Browser error() also beacons to /api/client-errors so the line lands in
// the Next server log and Laravel's file/Slack path with a correlation id.

import { getLastCorrelationId } from "@/lib/correlation";

type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

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
    reportClientError(message, context);
  } else {
    console.warn(line);
  }
}

function reportClientError(message: string, context?: LogContext): void {
  if (typeof window === "undefined") return;

  const correlationId =
    (typeof context?.correlationId === "string" && context.correlationId) ||
    getLastCorrelationId() ||
    crypto.randomUUID();

  const body = JSON.stringify({
    message,
    app: "frontend",
    path: window.location.pathname,
    digest: typeof context?.digest === "string" ? context.digest : undefined,
    stack: typeof context?.stack === "string" ? context.stack : undefined,
    correlation_id: correlationId,
    context: context ? redact(context) : undefined,
  });

  if (typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon("/api/client-errors", body);
  } else {
    fetch("/api/client-errors", { method: "POST", body, keepalive: true }).catch(() => undefined);
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => emit("info", message, context),
  warn: (message: string, context?: LogContext) => emit("warn", message, context),
  error: (message: string, context?: LogContext) => emit("error", message, context),
};
