import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/cookie-names";

// UX redirect only — Laravel Policies remain the only real authorization
// authority (see docs/ARCHITECTURE.md, "Authentication & Authorization").
// This didn't exist at all before Phase 4; admin route protection used to
// depend entirely on an API call failing and an axios interceptor
// redirecting after the page had already shelled out and rendered.
const PUBLIC_PATHS = ["/login", "/forgot-password", "/reset-password"];

function isPublic(pathname: string) {
    return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    if (isPublic(pathname)) return NextResponse.next();

    // Login is now cut over to the httpOnly cookie (see
    // src/lib/server-api.ts) — a session created before this cutover won't
    // carry it and will be redirected to log in again once.
    const token = req.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    if (token) return NextResponse.next();

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", `${pathname}${search || ""}`);

    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};
