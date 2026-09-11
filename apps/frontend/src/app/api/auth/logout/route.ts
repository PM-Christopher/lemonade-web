import { NextResponse } from "next/server";
import { userAuthRoutes } from "@lemonade/api-types";
import { backendApi, clearUserSession } from "@/lib/server-api";

export async function POST() {
    // Best-effort — this revokes every token belonging to the user
    // server-side (LogoutUser::execute). If it fails (already-expired
    // token, network blip), the cookie still gets cleared below, so the
    // client is logged out either way.
    await backendApi.post(userAuthRoutes.LOGOUT).catch(() => undefined);
    clearUserSession();
    return NextResponse.json({ success: true, message: "Logged out" });
}
