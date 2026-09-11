// BFF proxy — the one place apps/frontend's browser-side code is allowed to
// reach through to lemonade-backend. Forwards /api/v1/<...path> to
// `${LARAVEL_API_URL}/v1/<...path>` with the Bearer token read server-side
// from the httpOnly cookie (see ../../../lib/server-api.ts). The browser
// never sees or sends the token itself.
//
// Scope: JSON request/response bodies only. Multipart (file upload) is not
// proxied yet — apps/frontend/src/components/global/FileUploader.tsx and
// friends keep using the old direct-to-Laravel axiosInstance until that's
// built, which is fine since nothing has been cut over to this proxy yet.
//
// Next 14 (this app): route handler `params` are synchronous. Next 15
// (apps/admin): async — see the admin equivalent of this file.
import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@lemonade/api-client";
import { backendApi } from "@/lib/server-api";

const JSON_METHODS = new Set(["POST", "PATCH", "PUT"]);

async function handle(req: NextRequest, path: string[], method: string): Promise<NextResponse> {
    const targetUrl = `/${path.join("/")}${req.nextUrl.search}`;
    const correlationId = req.headers.get("x-correlation-id") ?? undefined;

    let data: unknown;
    if (JSON_METHODS.has(method)) {
        const contentType = req.headers.get("content-type") ?? "";
        if (contentType && !contentType.includes("application/json")) {
            return NextResponse.json(
                { success: false, message: "Unsupported content type for the BFF proxy — JSON only.", error_code: "not-specified" },
                { status: 415 },
            );
        }
        data = await req.json().catch(() => undefined);
    }

    try {
        const result = await backendApi.request({
            url: targetUrl,
            method,
            data,
            ...(correlationId ? { headers: { "X-Correlation-Id": correlationId } } : {}),
        });
        return NextResponse.json({ success: true, message: "OK", data: result });
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
        return NextResponse.json({ success: false, message: "Unexpected proxy error.", error_code: "not-specified" }, { status: 500 });
    }
}

interface RouteParams {
    params: { path: string[] };
}

export function GET(req: NextRequest, { params }: RouteParams) {
    return handle(req, params.path, "GET");
}

export function POST(req: NextRequest, { params }: RouteParams) {
    return handle(req, params.path, "POST");
}

export function PATCH(req: NextRequest, { params }: RouteParams) {
    return handle(req, params.path, "PATCH");
}

export function PUT(req: NextRequest, { params }: RouteParams) {
    return handle(req, params.path, "PUT");
}

export function DELETE(req: NextRequest, { params }: RouteParams) {
    return handle(req, params.path, "DELETE");
}
