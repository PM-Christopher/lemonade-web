// middleware.ts (project root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

    const token = req.cookies.get("token")?.value; // ✅ your real auth cookie
    if (token) return NextResponse.next();

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", `${pathname}${search || ""}`);

    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};
