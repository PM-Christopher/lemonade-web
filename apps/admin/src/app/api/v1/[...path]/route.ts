// BFF proxy — the one place apps/admin's browser-side code is allowed to
// reach through to lemonade-backend. Forwards /api/v1/<...path> to
// `${LARAVEL_API_URL}/v1/<...path>` with the Bearer token read server-side
// from the httpOnly cookie (see ../../../lib/server-api.ts). The browser
// never sees or sends the token itself.
//
// Multipart (file upload) bodies are forwarded byte-for-byte with the
// original Content-Type (boundary included) rather than parsed — this
// proxy doesn't need to know what's inside an upload, only pass it through.
// This matters now that lib/axiosInstane.ts routes everything through this
// proxy, uploads included.
//
// Next 15 (this app): route handler `params` are async. Next 14
// (apps/frontend): sync — see the frontend equivalent of this file.
import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@lemonade/api-client";
import { backendApi } from "@/lib/server-api";

const JSON_METHODS = new Set(["POST", "PATCH", "PUT"]);

async function handle(req: NextRequest, path: string[], method: string): Promise<NextResponse> {
  const targetUrl = `/${path.join("/")}${req.nextUrl.search}`;
  const correlationId = req.headers.get("x-correlation-id") ?? undefined;
  // docs/ARCHITECTURE.md §22 Conflict 3 — without this, every request reaches
  // Laravel from the Next server's own IP, and TrustProxies (already
  // configured to honour these) has nothing real to resolve. Forwarded as-is
  // from whatever this Next server itself received — never fabricated, so a
  // request with no upstream proxy in front of Next simply carries none.
  const forwardedFor = req.headers.get("x-forwarded-for") ?? undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;

  let data: unknown;
  let bodyContentType: string | undefined;

  if (JSON_METHODS.has(method)) {
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      data = Buffer.from(await req.arrayBuffer());
      bodyContentType = contentType; // carries the boundary — must be forwarded verbatim
    } else if (!contentType || contentType.includes("application/json")) {
      data = await req.json().catch(() => undefined);
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Unsupported content type for the BFF proxy.",
          error_code: "not-specified",
        },
        { status: 415 },
      );
    }
  }

  try {
    const result = await backendApi.request({
      url: targetUrl,
      method,
      data,
      headers: {
        ...(correlationId ? { "X-Correlation-Id": correlationId } : {}),
        ...(bodyContentType ? { "Content-Type": bodyContentType } : {}),
        ...(forwardedFor ? { "X-Forwarded-For": forwardedFor } : {}),
        ...(userAgent ? { "User-Agent": userAgent } : {}),
      },
    });
    return NextResponse.json({ success: true, message: "OK", data: result });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          message: err.message,
          error_code: err.errorCode,
          ...(err.fieldErrors ? { errors: err.fieldErrors } : {}),
        },
        { status: err.status || 502 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Unexpected proxy error.", error_code: "not-specified" },
      { status: 500 },
    );
  }
}

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  return handle(req, (await params).path, "GET");
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  return handle(req, (await params).path, "POST");
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  return handle(req, (await params).path, "PATCH");
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  return handle(req, (await params).path, "PUT");
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  return handle(req, (await params).path, "DELETE");
}
