// Proxies Pusher's private/presence channel authorization to the real
// backend, attaching the httpOnly session cookie's token server-side —
// the browser never holds or sends it. Mirrors app/api/v1/[...path]/route.ts,
// but calls the backend's /broadcasting/auth directly (unversioned, not
// under /v1, so it can't go through backendApi's /v1-scoped baseURL).
//
// Config on the Pusher client side just needs `authEndpoint: "/api/broadcasting/auth"`
// (see config/pusherConfig.ts) — no token, no manual Authorization header.
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { USER_TOKEN_COOKIE } from "@/lib/cookie-names";

const LARAVEL_API_URL = process.env.LARAVEL_API_URL;

export async function POST(req: NextRequest) {
    const token = cookies().get(USER_TOKEN_COOKIE)?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") ?? "application/x-www-form-urlencoded";
    const body = await req.arrayBuffer();

    const upstream = await fetch(`${LARAVEL_API_URL}/broadcasting/auth`, {
        method: "POST",
        headers: {
            "Content-Type": contentType,
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body,
    });

    const data = await upstream.text();

    return new NextResponse(data, {
        status: upstream.status,
        headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
    });
}
