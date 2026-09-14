// AccountController::export streams a raw text/csv response, not the
// standard {success,message,data} JSON envelope — browserApi's unwrap()
// would silently lose the body trying to read `.data.data` off a CSV
// string. Same reasoning as app/api/broadcasting/auth/route.ts: a
// dedicated pass-through proxy that attaches the real token server-side
// from the httpOnly cookie, forwarding the response as-is either way
// (CSV bytes on success, the normal JSON error envelope on failure — the
// client tells them apart by Content-Type, see features/exports/api.ts).
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_TOKEN_COOKIE } from "@/lib/cookie-names";

const LARAVEL_API_URL = process.env.LARAVEL_API_URL;

export async function GET(req: NextRequest) {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const table = req.nextUrl.searchParams.get("table");

  if (!table) {
    return NextResponse.json({ message: "table is required" }, { status: 422 });
  }

  const upstream = await fetch(
    `${LARAVEL_API_URL}/v1/admin/account/export?table=${encodeURIComponent(table)}&type=csv`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  const body = await upstream.arrayBuffer();

  return new NextResponse(body, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "text/csv" },
  });
}
