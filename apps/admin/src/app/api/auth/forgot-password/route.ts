// Starts a password reset: emails the code and keeps the temporary token in an httpOnly cookie.
import { NextResponse, type NextRequest } from "next/server";
import { adminAuthRoutes } from "@lemonade/api-types/generated";
import { messageOr } from "@/lib/api-message";
import { RESET_EMAIL_COOKIE, RESET_TOKEN_COOKIE } from "@/lib/cookie-names";
import { readResetCookie, resetErrorResponse, setResetCookie } from "@/lib/reset-session";
import { backendApi } from "@/lib/server-api";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  // Re-sending the code reuses the email remembered from the first request.
  const email: unknown = body?.email ?? readResetCookie(req, RESET_EMAIL_COOKIE);

  if (typeof email !== "string" || email === "") {
    return NextResponse.json(
      { success: false, message: "Enter your email address.", error_code: "validation-failed" },
      { status: 422 },
    );
  }

  try {
    const { data, message } = await backendApi.requestWithHeaders<{ token: string }>({
      url: adminAuthRoutes.FORGOT_PASSWORD,
      method: "post",
      data: { email },
    });

    const response = NextResponse.json({
      success: true,
      message: messageOr(message, "A verification code has been sent to your email"),
      data: { email },
    });
    setResetCookie(response, RESET_TOKEN_COOKIE, data.token);
    setResetCookie(response, RESET_EMAIL_COOKIE, email);
    return response;
  } catch (err) {
    return resetErrorResponse(err);
  }
}
