import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/cookie-names";

// UX redirect only — Laravel Policies remain the only real authorization
// authority (see docs/ARCHITECTURE.md, "Authentication & Authorization").
// This didn't exist at all before Phase 4; admin route protection used to
// depend entirely on an API call failing and an axios interceptor
// redirecting after the page had already shelled out and rendered.
const PUBLIC_PATHS = ["/login", "/forgot-password", "/reset-password"];

// LEGACY_TOKEN_COOKIE is the JS-readable cookie the current (unmigrated)
// login flow sets — src/features/authentication/authApi.ts, `setCookie("token", ...)`.
// Checked alongside the new httpOnly ADMIN_TOKEN_COOKIE so shipping this
// middleware doesn't lock out every session that logged in before the login
// route itself is cut over to the new BFF flow. Drop this once that cutover
// lands — Phase 5 work.
const LEGACY_TOKEN_COOKIE = "token";

function isPublic(pathname: string) {
    return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    if (isPublic(pathname)) return NextResponse.next();

    const token = req.cookies.get(ADMIN_TOKEN_COOKIE)?.value ?? req.cookies.get(LEGACY_TOKEN_COOKIE)?.value;
    if (token) return NextResponse.next();

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", `${pathname}${search || ""}`);

    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};
