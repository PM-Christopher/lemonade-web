// Google sign-in broker: stores the access token in an httpOnly cookie for finished accounts.
import { NextResponse } from "next/server";
import { userAuthRoutes } from "@lemonade/api-types/generated";
import { backendApi, persistUserSession, syncSignedInCookieFromHeaders } from "@/lib/server-api";
import { messageOr } from "@/lib/api-message";
import { bffErrorResponse, needsOnboarding, type BackendAuthResult } from "@/lib/auth-bff";

export async function POST(req: Request) {
  const body = await req.json().catch(() => undefined);

  if (!body?.token) {
    return NextResponse.json(
      { success: false, message: "Google token is required.", error_code: "validation-failed" },
      { status: 422 },
    );
  }

  try {
    const {
      data: result,
      headers: responseHeaders,
      message,
    } = await backendApi.requestWithHeaders<BackendAuthResult>({
      url: userAuthRoutes.GOOGLE,
      method: "post",
      data: { token: body.token, ...(body.password ? { password: body.password } : {}) },
    });

    // Unfinished onboarding keeps a short-lived token; no main session cookie.
    if (needsOnboarding(result)) {
      return NextResponse.json({
        success: true,
        message: messageOr(message, "Login successful"),
        data: {
          user: result.user,
          token: result.token,
          token_type: result.token_type,
          needsOnboarding: true,
        },
      });
    }

    await persistUserSession(result.token, result.refresh_token, result.expires_in);
    await syncSignedInCookieFromHeaders(responseHeaders);

    return NextResponse.json({
      success: true,
      message: messageOr(message, "Login successful"),
      data: { user: result.user },
    });
  } catch (err) {
    return bffErrorResponse(err);
  }
}
