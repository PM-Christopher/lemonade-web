// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

const request = (path: string, cookie?: string) =>
  new NextRequest(`http://localhost:3001${path}`, cookie ? { headers: { cookie } } : undefined);

describe("admin middleware login page", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("sends a signed-in admin from /login to the overview", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { admin: { permissions: [] } } }),
      }),
    );

    const res = await middleware(request("/login", "lemonade_admin_token=abc"));

    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location") ?? "").pathname).toBe("/");
  });

  it("shows login when the session has ended", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    const res = await middleware(request("/login", "lemonade_admin_token=expired"));

    expect(res.status).toBe(200);
  });

  it("shows login when signed out", async () => {
    const res = await middleware(request("/login"));

    expect(res.status).toBe(200);
  });
});
