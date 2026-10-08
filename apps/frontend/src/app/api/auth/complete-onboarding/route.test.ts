// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requestWithHeaders = vi.fn();
const persistUserSession = vi.fn();
const syncSignedInCookieFromHeaders = vi.fn();

vi.mock("server-only", () => ({}));
vi.mock("@/lib/server-api", () => ({
  backendApi: { requestWithHeaders: (...args: unknown[]) => requestWithHeaders(...args) },
  persistUserSession: (...args: unknown[]) => persistUserSession(...args),
  syncSignedInCookieFromHeaders: (...args: unknown[]) => syncSignedInCookieFromHeaders(...args),
}));

const { POST } = await import("./route");

const post = (cookie?: string) =>
  POST(
    new NextRequest("http://localhost/api/auth/complete-onboarding", {
      method: "POST",
      body: JSON.stringify({ socials: [{ name: "twitter", value: "ada" }] }),
      headers: cookie ? { cookie } : {},
    }),
  );

describe("POST /api/auth/complete-onboarding", () => {
  beforeEach(() => {
    requestWithHeaders.mockReset();
    persistUserSession.mockReset();
  });

  it("needs the onboarding cookie", async () => {
    const res = await post();
    expect(res.status).toBe(401);
    expect(requestWithHeaders).not.toHaveBeenCalled();
  });

  it("swaps the onboarding token for a server-side session and clears the cookie", async () => {
    const user = { id: 1, email: "a@b.co", fullname: "Ada", username: "ada" };
    requestWithHeaders.mockResolvedValue({
      data: {
        user,
        token: "access",
        refresh_token: "refresh",
        expires_in: 3600,
        token_type: "access",
      },
      headers: {},
    });

    const res = await post("newToken=onboarding-token");
    const body = await res.json();

    expect(requestWithHeaders).toHaveBeenCalledWith(
      expect.objectContaining({ bearerTokenOverride: "onboarding-token", method: "post" }),
    );
    expect(persistUserSession).toHaveBeenCalledWith("access", "refresh", 3600);
    expect(body.data).toEqual({ user });
    expect(res.headers.get("set-cookie")).toMatch(/newToken=;.*Max-Age=0/i);
  });
});
