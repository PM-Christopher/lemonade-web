// Final onboarding step: saves socials, then swaps the onboarding token for an httpOnly session.
import { NextResponse, type NextRequest } from "next/server";
import { userProfileRoutes } from "@lemonade/api-types/generated";
import { backendApi, persistUserSession, syncSignedInCookieFromHeaders } from "@/lib/server-api";
import { bffErrorResponse, type BackendAuthResult } from "@/lib/auth-bff";
import { ONBOARDING_TOKEN_COOKIE } from "@/lib/cookie-names";

export async function POST(req: NextRequest) {
  const onboardingToken = req.cookies.get(ONBOARDING_TOKEN_COOKIE)?.value;

  if (!onboardingToken) {
    return NextResponse.json(
      {
        success: false,
        message: "Your sign-up session has expired. Please log in again.",
        error_code: "unauthorized",
      },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({}));

  try {
    const { data: result, headers: responseHeaders } =
      await backendApi.requestWithHeaders<BackendAuthResult>({
        url: userProfileRoutes.SOCIALS_SET_UP,
        method: "post",
        data: body,
        bearerTokenOverride: onboardingToken,
      });

    await persistUserSession(result.token, result.refresh_token, result.expires_in);
    await syncSignedInCookieFromHeaders(responseHeaders);

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully",
      data: { user: result.user },
    });
    // Clear the onboarding cookie on the same path the client set it on.
    response.cookies.set(ONBOARDING_TOKEN_COOKIE, "", { path: "/", expires: new Date(0) });
    return response;
  } catch (err) {
    return bffErrorResponse(err);
  }
}
