// @vitest-environment node
import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

const request = (path: string, cookie?: string) =>
  new NextRequest(`http://localhost:3000${path}`, cookie ? { headers: { cookie } } : undefined);

describe("middleware guest tribe links", () => {
  it("rewrites a tribe link to the guest preview when signed out", () => {
    const res = middleware(request("/tribe/naija-arts"));

    expect(res.headers.get("x-middleware-rewrite")).toContain("/share/tribe/naija-arts");
    expect(res.status).toBe(200);
  });

  it("leaves a tribe link alone for a signed-in visitor", () => {
    const res = middleware(request("/tribe/naija-arts", "lemonade_user_token=abc"));

    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("still sends other protected pages to login", () => {
    const res = middleware(request("/event/some-event"));

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login?next=%2Fevent%2Fsome-event");
  });
});
