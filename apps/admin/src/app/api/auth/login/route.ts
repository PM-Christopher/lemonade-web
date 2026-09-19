// Auth broker — the only place a plaintext access token ever exists in a
// JSON response body. It's persisted into the httpOnly cookie here and
// stripped before the response reaches the browser for a fully set-up
// admin; the client only ever sees `{ admin }` in that case.
//
// An admin whose profile isn't finished yet (status 0) is a deliberate
// exception, same reasoning as the frontend's equivalent route: that
// narrower flow keeps using a short-lived, JS-readable token rather than
// the httpOnly session cookie.
import { NextResponse } from "next/server";
import { ApiError } from "@lemonade/api-client";
import { adminAuthRoutes } from "@lemonade/api-types/generated";
import { backendApi, persistAdminSession } from "@/lib/server-api";

interface LoginAdmin {
  id: string | number;
  email: string;
  name: string;
  status?: number;
}

interface LoginResponse {
  admin: LoginAdmin;
  token: string;
  refresh_token?: string;
  expires_in?: number;
}

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
    const result = await backendApi.post<LoginResponse>(adminAuthRoutes.LOGIN, body);

    if (result.admin.status === 0) {
      return NextResponse.json({
        success: true,
        message: "Login successful",
        data: { admin: result.admin, token: result.token, needsOnboarding: true },
      });
    }

    await persistAdminSession(result.token, result.refresh_token, result.expires_in);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: { admin: result.admin },
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
