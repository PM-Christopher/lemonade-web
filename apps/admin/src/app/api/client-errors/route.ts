import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

// Receives browser error beacons from lib/logger.ts, logs them here, then
// forwards to Laravel so laravel.log / Slack see the same correlation id.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.message !== "string") {
    return new NextResponse(null, { status: 204 });
  }

  const correlationId =
    (typeof body.correlation_id === "string" && body.correlation_id) ||
    req.headers.get("x-correlation-id") ||
    crypto.randomUUID();

  logger.error("client error", {
    message: body.message,
    app: body.app,
    path: body.path,
    digest: body.digest,
    correlationId,
    context: body.context,
  });

  const apiUrl = process.env.LARAVEL_API_URL;
  if (apiUrl) {
    try {
      await fetch(`${apiUrl}/v1/shared/client-errors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Correlation-Id": correlationId,
        },
        body: JSON.stringify({
          message: body.message,
          app: body.app === "admin" ? "admin" : "frontend",
          path: typeof body.path === "string" ? body.path : undefined,
          digest: typeof body.digest === "string" ? body.digest : undefined,
          stack: typeof body.stack === "string" ? body.stack : undefined,
          correlation_id: correlationId,
          context: typeof body.context === "object" && body.context ? body.context : undefined,
        }),
        signal: AbortSignal.timeout(3_000),
      });
    } catch {
      // Local log already has the line; Laravel outage must not fail the beacon.
    }
  }

  return new NextResponse(null, { status: 204 });
}
