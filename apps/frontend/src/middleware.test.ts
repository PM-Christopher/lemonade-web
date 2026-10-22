// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

const request = (path: string, cookie?: string) =>
  new NextRequest(`http://localhost:3000${path}`, cookie ? { headers: { cookie } } : undefined);

describe("middleware guest tribe links", () => {
  it("rewrites a tribe link to the guest preview when signed out", async () => {
    const res = await middleware(request("/tribe/naija-arts"));

    expect(res.headers.get("x-middleware-rewrite")).toContain("/share/tribe/naija-arts");
    expect(res.status).toBe(200);
  });

  it("leaves a tribe link alone for a signed-in visitor", async () => {
    const res = await middleware(request("/tribe/naija-arts", "lemonade_user_token=abc"));

    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("still sends other protected pages to login", async () => {
    const res = await middleware(request("/event/some-event"));

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login?next=%2Fevent%2Fsome-event");
  });
});

describe("middleware login and signup for signed-in users", () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each(["/login", "/signup"])("sends a signed-in user from %s to home", async (path) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

    const res = await middleware(request(path, "lemonade_user_token=abc"));

    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location") ?? "").pathname).toBe("/");
  });

  it("shows login to a visitor whose session has ended", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    const res = await middleware(request("/login", "lemonade_user_token=expired"));

    expect(res.status).toBe(200);
  });

  it("shows login to a visitor with no session", async () => {
    const res = await middleware(request("/login"));

    expect(res.status).toBe(200);
  });
});
