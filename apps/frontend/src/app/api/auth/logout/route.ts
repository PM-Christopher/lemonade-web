import { NextResponse } from "next/server";
import { userProfileRoutes } from "@lemonade/api-types/generated";
import { messageOr } from "@/lib/api-message";
import { backendApi, clearUserSession } from "@/lib/server-api";

export async function POST() {
  // Best-effort — this revokes every token belonging to the user
  // server-side (LogoutUser::execute). If it fails (already-expired
  // token, network blip), the cookie still gets cleared below, so the
  // client is logged out either way.
  // Lives under /user/profile/logout on the backend, not /user/auth/* —
  // the generated routes group by controller, so this one's under
  // userProfileRoutes, unlike LOGIN/REFRESH which stay under userAuthRoutes.
  const result = await backendApi
    .requestWithHeaders({ url: userProfileRoutes.LOGOUT, method: "post" })
    .catch(() => undefined);
  await clearUserSession();
  return NextResponse.json({ success: true, message: messageOr(result?.message, "Logged out") });
}
