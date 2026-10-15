import { NextResponse } from "next/server";
import { adminAuthRoutes } from "@lemonade/api-types/generated";
import { messageOr } from "@/lib/api-message";
import { backendApi, clearAdminSession } from "@/lib/server-api";

// POST /v1/admin/auth/logout now exists and revokes every token belonging
// to the admin (LogoutAdmin::execute) — previously AuthController::logout()
// was a stub with no route at all, so this only cleared the local cookie.
export async function POST() {
  const result = await backendApi
    .requestWithHeaders({ url: adminAuthRoutes.LOGOUT, method: "post" })
    .catch(() => undefined);
  await clearAdminSession();
  return NextResponse.json({ success: true, message: messageOr(result?.message, "Logged out") });
}
