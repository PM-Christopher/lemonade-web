// BFF proxy. Forwards /api/v1/* to the backend with the token from the httpOnly cookie,
// or mid-signup the onboarding cookie (onboardingAuth). Uploads pass through byte for byte.
import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@lemonade/api-client";
import { messageOr } from "@/lib/api-message";
import { backendApi, onboardingAuth, syncSignedInCookieFromHeaders } from "@/lib/server-api";

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

  const auth = await onboardingAuth();

  try {
    const {
      data: result,
      headers: responseHeaders,
      message,
    } = await backendApi.requestWithHeaders({
      url: targetUrl,
      method,
      data,
      headers: {
        ...(correlationId ? { "X-Correlation-Id": correlationId } : {}),
        ...(bodyContentType ? { "Content-Type": bodyContentType } : {}),
        ...(forwardedFor ? { "X-Forwarded-For": forwardedFor } : {}),
        ...(userAgent ? { "User-Agent": userAgent } : {}),
      },
      ...auth,
    });
    // Relays the backend's own signed-in indicator cookie onto the browser's
    // response — see syncSignedInCookieFromHeaders's docblock. Every ordinary
    // authenticated call goes through here, so this is what actually gives
    // the cookie its sliding-window renewal.
    await syncSignedInCookieFromHeaders(responseHeaders);
    return NextResponse.json({ success: true, message: messageOr(message, "OK"), data: result });
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

export async function GET(req: NextRequest, props: RouteParams) {
  const params = await props.params;
  return handle(req, params.path, "GET");
}

export async function POST(req: NextRequest, props: RouteParams) {
  const params = await props.params;
  return handle(req, params.path, "POST");
}

export async function PATCH(req: NextRequest, props: RouteParams) {
  const params = await props.params;
  return handle(req, params.path, "PATCH");
}

export async function PUT(req: NextRequest, props: RouteParams) {
  const params = await props.params;
  return handle(req, params.path, "PUT");
}

export async function DELETE(req: NextRequest, props: RouteParams) {
  const params = await props.params;
  return handle(req, params.path, "DELETE");
}
