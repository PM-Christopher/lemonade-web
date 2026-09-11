// Auth broker — the only place a plaintext access token ever exists in a
// JSON response body. It's persisted into the httpOnly cookie here and
// stripped before the response reaches the browser; the client only ever
// sees `{ admin }`.
import { NextResponse } from "next/server";
import { ApiError } from "@lemonade/api-client";
import { adminAuthRoutes } from "@lemonade/api-types";
import { backendApi, persistAdminSession } from "@/lib/server-api";

interface LoginResponse {
    admin: unknown;
    token: string;
    refresh_token?: string;
    expires_in?: number;
}

export async function POST(req: Request) {
    const body = await req.json().catch(() => undefined);

    if (!body?.email || !body?.password) {
        return NextResponse.json(
            { success: false, message: "Email and password are required.", error_code: "validation-failed" },
            { status: 422 },
        );
    }

    try {
        const result = await backendApi.post<LoginResponse>(adminAuthRoutes.LOGIN, body);

        await persistAdminSession(result.token, result.refresh_token, result.expires_in);

        return NextResponse.json({ success: true, message: "Login successful", data: { admin: result.admin } });
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
