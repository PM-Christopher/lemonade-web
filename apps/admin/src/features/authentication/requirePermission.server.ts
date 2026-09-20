import "server-only";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { authServerApi } from "./api.server";

/**
 * Section-level gate for Server Component pages. The real HTTP 404 for a
 * gated section comes from middleware.ts (App Router's notFound() can't
 * correct the status code once a cookie-dependent Server Component's
 * response starts streaming — confirmed with an isolated reproduction, see
 * middleware.ts's comment); this is defense in depth on top of that, per
 * this repo's "Server Component render: never ship markup the user can't
 * use" authorization layer. UX only either way — the backend's
 * can:<section>.write middleware is the real authority regardless. See
 * docs/ARCHITECTURE.md §22 Conflict 2.
 */
export async function requireAdminPermission(permission: string): Promise<void> {
  const permissions = await getPermissions();
  if (permissions === null) {
    // Not authenticated, or the backend call failed — let the existing
    // client-side redirect-to-login flow (MainLayout) handle it instead of
    // 404ing someone who simply isn't logged in yet.
    return;
  }

  if (!permissions.includes(permission)) {
    notFound();
  }
}

async function getPermissions(): Promise<string[] | null> {
  // middleware.ts already fetched this admin's permissions to decide
  // whether to let this request through at all — reuse that instead of
  // fetching the same profile a second time (this route's own request,
  // on top of middleware's, on top of the client's useCurrentAdminQuery,
  // was tripling load against the backend's 60/min-per-admin throttle for
  // every navigation; found by hitting that limit running the e2e suite).
  const forwarded = (await headers()).get("x-admin-permissions");
  if (forwarded !== null) {
    return forwarded === "" ? [] : forwarded.split(",");
  }

  try {
    const admin = await authServerApi.getCurrentAdmin();
    return admin.permissions ?? [];
  } catch {
    return null;
  }
}
