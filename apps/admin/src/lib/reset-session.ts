import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@lemonade/api-client";
import { RESET_CODE_COOKIE, RESET_EMAIL_COOKIE, RESET_TOKEN_COOKIE } from "@/lib/cookie-names";

// Matches the backend's password reset token lifetime window.
const RESET_MAX_AGE_SECONDS = 60 * 30;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: RESET_MAX_AGE_SECONDS,
};

export function setResetCookie(response: NextResponse, name: string, value: string): void {
  response.cookies.set(name, value, cookieOptions);
}

export function clearResetCookies(response: NextResponse): void {
  for (const name of [RESET_TOKEN_COOKIE, RESET_CODE_COOKIE, RESET_EMAIL_COOKIE]) {
    response.cookies.set(name, "", { path: "/", expires: new Date(0) });
  }
}

export function readResetCookie(req: NextRequest, name: string): string | undefined {
  return req.cookies.get(name)?.value;
}

export function expiredResetResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message: "Your password reset session has expired. Please request a new code.",
      error_code: "unauthorized",
    },
    { status: 401 },
  );
}

export function resetErrorResponse(err: unknown): NextResponse {
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
  return NextResponse.json({ success: false, message: "Unexpected error." }, { status: 500 });
}
