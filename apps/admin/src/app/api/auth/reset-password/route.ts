// Saves the new password, then clears the reset cookies.
import { NextResponse, type NextRequest } from "next/server";
import { adminAuthRoutes } from "@lemonade/api-types/generated";
import { messageOr } from "@/lib/api-message";
import { RESET_CODE_COOKIE, RESET_TOKEN_COOKIE } from "@/lib/cookie-names";
import {
  clearResetCookies,
  expiredResetResponse,
  readResetCookie,
  resetErrorResponse,
} from "@/lib/reset-session";
import { backendApi } from "@/lib/server-api";

export async function POST(req: NextRequest) {
  const token = readResetCookie(req, RESET_TOKEN_COOKIE);
  const code = readResetCookie(req, RESET_CODE_COOKIE);
  if (!token || !code) return expiredResetResponse();

  const body = await req.json().catch(() => ({}));

  try {
    const { message } = await backendApi.requestWithHeaders({
      url: adminAuthRoutes.RESET_PASSWORD,
      method: "patch",
      data: { code, password: body?.password },
      bearerTokenOverride: token,
    });

    const response = NextResponse.json({
      success: true,
      message: messageOr(message, "Password updated. Log in with your new password."),
      data: {},
    });
    clearResetCookies(response);
    return response;
  } catch (err) {
    return resetErrorResponse(err);
  }
}
