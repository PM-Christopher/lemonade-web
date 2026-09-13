// middleware.ts (project root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { USER_TOKEN_COOKIE } from "@/lib/cookie-names";

// UX redirect only — Laravel Policies remain the only real authorization
// authority. Now checks the httpOnly lemonade_user_token cookie set by
// app/api/auth/login/route.ts, now that login is cut over to it — see
// src/lib/server-api.ts. The old JS-readable "token" cookie is no longer
// set by anything; a session created before this cutover won't carry the
// new cookie and will be redirected to log in again once.

const PUBLIC_PATHS = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/verify-code",
    "/profile-setup",
];

const PROTECTED_PREFIXES = ["/event", "/tribe", "/business", "/", "/settings"];

function isPublic(pathname: string) {
    return PUBLIC_PATHS.includes(pathname);
}
function isProtected(pathname: string) {
    return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    if (isPublic(pathname)) return NextResponse.next();
    if (!isProtected(pathname)) return NextResponse.next();

    const token = req.cookies.get(USER_TOKEN_COOKIE)?.value;
    if (token) return NextResponse.next();

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", `${pathname}${search || ""}`);

    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};
