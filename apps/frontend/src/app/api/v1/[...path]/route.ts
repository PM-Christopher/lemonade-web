// BFF proxy — the one place apps/frontend's browser-side code is allowed to
// reach through to lemonade-backend. Forwards /api/v1/<...path> to
// `${LARAVEL_API_URL}/v1/<...path>` with the Bearer token read server-side
// from the httpOnly cookie (see ../../../lib/server-api.ts). The browser
// never sees or sends the real session token itself.
//
// Multipart (file upload) bodies are forwarded byte-for-byte with the
// original Content-Type (boundary included) rather than parsed — this
// proxy doesn't need to know what's inside an upload, only pass it through.
// This matters now that lib/axiosInstane.ts routes everything through this
// proxy, uploads included (see features/shared/api.ts).
//
// Pre-login onboarding fallback: signup/email-verification/reset-password
// calls (features/authentication/{api,mutations}.ts's verifyAccountOtp/
// verifyPasswordResetOtp/resendOtp/resetPassword, features/settings/api.ts's
// getUserProfile, used by profile-setup/page.tsx before a real session
// exists) don't have a main session yet — they carry their own short-lived,
// ability-scoped token in ONBOARDING_TOKEN_COOKIE (see lib/cookie-names.ts).
// Read it server-side, same trust level as the main session cookie, and use
// it only when there's no main session — never forward the browser's own
// Authorization header (backendApi's transport strips that unconditionally
// regardless).
//
// Next 14 (this app): route handler `params` are synchronous. Next 15
// (apps/admin): async — see the admin equivalent of this file.
import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@lemonade/api-client";
import { backendApi, USER_TOKEN_COOKIE } from "@/lib/server-api";
import { ONBOARDING_TOKEN_COOKIE } from "@/lib/cookie-names";

const JSON_METHODS = new Set(["POST", "PATCH", "PUT"]);

async function handle(req: NextRequest, path: string[], method: string): Promise<NextResponse> {
  const targetUrl = `/${path.join("/")}${req.nextUrl.search}`;
  const correlationId = req.headers.get("x-correlation-id") ?? undefined;

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

  const hasSession = Boolean(req.cookies.get(USER_TOKEN_COOKIE)?.value);
  const onboardingToken = hasSession ? undefined : req.cookies.get(ONBOARDING_TOKEN_COOKIE)?.value;

  try {
    const result = await backendApi.request({
      url: targetUrl,
      method,
      data,
      headers: {
        ...(correlationId ? { "X-Correlation-Id": correlationId } : {}),
        ...(bodyContentType ? { "Content-Type": bodyContentType } : {}),
      },
      ...(onboardingToken ? { bearerTokenOverride: onboardingToken } : {}),
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
  params: { path: string[] };
}

export function GET(req: NextRequest, { params }: RouteParams) {
  return handle(req, params.path, "GET");
}

export function POST(req: NextRequest, { params }: RouteParams) {
  return handle(req, params.path, "POST");
}

export function PATCH(req: NextRequest, { params }: RouteParams) {
  return handle(req, params.path, "PATCH");
}

export function PUT(req: NextRequest, { params }: RouteParams) {
  return handle(req, params.path, "PUT");
}

export function DELETE(req: NextRequest, { params }: RouteParams) {
  return handle(req, params.path, "DELETE");
}
