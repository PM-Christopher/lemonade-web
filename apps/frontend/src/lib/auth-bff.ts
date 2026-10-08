import "server-only";

// Shared pieces for the /api/auth/* Route Handlers that turn backend tokens into an httpOnly session.
import { NextResponse } from "next/server";
import { ApiError } from "@lemonade/api-client";

export interface BackendAuthUser {
  id: string | number;
  email: string;
  fullname: string;
  username: string | null;
  status?: number;
  email_verified?: boolean;
}

export interface BackendAuthResult {
  user: BackendAuthUser;
  token: string;
  token_type: string;
  refresh_token?: string;
  expires_in?: number;
}

const ACCOUNT_VERIFICATION_TOKEN = "account_verification_token";

/** True while the account still has onboarding steps, so it gets no main session yet. */
export function needsOnboarding(result: BackendAuthResult): boolean {
  return (
    result.token_type === ACCOUNT_VERIFICATION_TOKEN ||
    result.user.status === 0 ||
    result.user.username === null
  );
}

/** Turns a failed backend call into the standard error envelope for the browser. */
export function bffErrorResponse(err: unknown): NextResponse {
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
