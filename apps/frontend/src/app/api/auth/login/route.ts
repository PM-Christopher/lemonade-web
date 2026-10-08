// Login broker: stores the access token in an httpOnly cookie for finished accounts.
import { NextResponse } from "next/server";
import { ApiError } from "@lemonade/api-client";
import { userAuthRoutes } from "@lemonade/api-types/generated";
import { backendApi, persistUserSession, syncSignedInCookieFromHeaders } from "@/lib/server-api";

interface LoginUser {
  id: string | number;
  email: string;
  fullname: string;
  username: string | null;
  status?: number;
  email_verified?: boolean;
}

interface LoginResponse {
  user: LoginUser;
  token: string;
  token_type: string;
  refresh_token?: string;
  expires_in?: number;
}

const ACCOUNT_VERIFICATION_TOKEN = "account_verification_token";

export async function POST(req: Request) {
  const body = await req.json().catch(() => undefined);

  if (!body?.email || !body?.password) {
    return NextResponse.json(
      {
        success: false,
        message: "Email and password are required.",
        error_code: "validation-failed",
      },
      { status: 422 },
    );
  }

  try {
    const { data: result, headers: responseHeaders } =
      await backendApi.requestWithHeaders<LoginResponse>({
        url: userAuthRoutes.LOGIN,
        method: "post",
        data: body,
      });

    // Unfinished onboarding keeps a short-lived token; no main session cookie.
    const needsOnboarding =
      result.token_type === ACCOUNT_VERIFICATION_TOKEN ||
      result.user.status === 0 ||
      result.user.username === null;

    if (needsOnboarding) {
      return NextResponse.json({
        success: true,
        message: "Login successful",
        data: { user: result.user, token: result.token, needsOnboarding: true },
      });
    }

    await persistUserSession(result.token, result.refresh_token, result.expires_in);
    await syncSignedInCookieFromHeaders(responseHeaders);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: { user: result.user },
    });
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
    return NextResponse.json({ success: false, message: "Unexpected error." }, { status: 500 });
  }
}
