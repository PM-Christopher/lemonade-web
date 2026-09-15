// Auth broker — the only place a plaintext access token ever exists in a
// JSON response body. It's persisted into the httpOnly cookie here and
// stripped before the response reaches the browser for a fully-onboarded
// user — the client only ever sees `{ user }` in that case.
//
// A user who hasn't finished email verification or profile setup yet is a
// deliberate exception: that flow (verify-email / profile-setup) uses its
// own short-lived, narrower-scoped token via a JS-readable cookie, same as
// before this cutover — see docs/ARCHITECTURE.md and the memory note on
// this session's auth work for why that's explicitly out of scope here.
// This route tells the two cases apart and only gives the httpOnly
// treatment to the real one.
import { NextResponse } from "next/server";
import { ApiError } from "@lemonade/api-client";
import { userAuthRoutes } from "@lemonade/api-types";
import { backendApi, persistUserSession } from "@/lib/server-api";

interface LoginUser {
  id: string | number;
  email: string;
  fullname: string;
  username: string | null;
  status?: number;
}

interface LoginResponse {
  user: LoginUser;
  token: string;
  token_type: string;
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
    const result = await backendApi.post<LoginResponse>(userAuthRoutes.LOGIN, body);

    const needsOnboarding = result.user.status === 0 || result.user.username === null;

    if (needsOnboarding) {
      return NextResponse.json({
        success: true,
        message: "Login successful",
        data: { user: result.user, token: result.token, needsOnboarding: true },
      });
    }

    await persistUserSession(result.token, result.refresh_token, result.expires_in);

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
