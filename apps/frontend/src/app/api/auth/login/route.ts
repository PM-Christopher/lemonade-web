// Login broker: stores the access token in an httpOnly cookie for finished accounts.
import { NextResponse } from "next/server";
import { userAuthRoutes } from "@lemonade/api-types/generated";
import { backendApi, persistUserSession, syncSignedInCookieFromHeaders } from "@/lib/server-api";
import { messageOr } from "@/lib/api-message";
import { bffErrorResponse, needsOnboarding, type BackendAuthResult } from "@/lib/auth-bff";

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
    const {
      data: result,
      headers: responseHeaders,
      message,
    } = await backendApi.requestWithHeaders<BackendAuthResult>({
      url: userAuthRoutes.LOGIN,
      method: "post",
      data: body,
    });

    // Unfinished onboarding keeps a short-lived token; no main session cookie.
    if (needsOnboarding(result)) {
      return NextResponse.json({
        success: true,
        message: messageOr(message, "Login successful"),
        data: { user: result.user, token: result.token, needsOnboarding: true },
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
