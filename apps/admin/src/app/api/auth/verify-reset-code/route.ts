// Checks the emailed code and swaps the temporary token for the one that allows a reset.
import { NextResponse, type NextRequest } from "next/server";
import { adminAuthRoutes } from "@lemonade/api-types/generated";
import { messageOr } from "@/lib/api-message";
import { RESET_CODE_COOKIE, RESET_TOKEN_COOKIE } from "@/lib/cookie-names";
import {
  expiredResetResponse,
  readResetCookie,
  resetErrorResponse,
  setResetCookie,
} from "@/lib/reset-session";
import { backendApi } from "@/lib/server-api";

export async function POST(req: NextRequest) {
  const token = readResetCookie(req, RESET_TOKEN_COOKIE);
  if (!token) return expiredResetResponse();

  const body = await req.json().catch(() => ({}));
  if (typeof body?.code !== "string" || body.code === "") {
    return NextResponse.json(
      { success: false, message: "Enter the 4-digit code.", error_code: "validation-failed" },
      { status: 422 },
    );
  }

  try {
    const { data, message } = await backendApi.requestWithHeaders<{ token: string }>({
      url: adminAuthRoutes.CHECK_OTP,
      method: "post",
      data: { code: body.code },
      bearerTokenOverride: token,
    });

    const response = NextResponse.json({
      success: true,
      message: messageOr(message, "Code verified"),
      data: {},
    });
    setResetCookie(response, RESET_TOKEN_COOKIE, data.token);
    setResetCookie(response, RESET_CODE_COOKIE, body.code);
    return response;
  } catch (err) {
    return resetErrorResponse(err);
  }
}
