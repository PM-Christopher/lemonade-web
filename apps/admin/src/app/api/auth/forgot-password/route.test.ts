// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requestWithHeaders = vi.fn();

vi.mock("server-only", () => ({}));
vi.mock("@/lib/server-api", () => ({
  backendApi: { requestWithHeaders: (...args: unknown[]) => requestWithHeaders(...args) },
}));

const { POST } = await import("./route");

const post = (body: unknown, cookie?: string) =>
  POST(
    new NextRequest("http://localhost/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(body),
      headers: cookie ? { cookie } : undefined,
    }),
  );

describe("POST /api/auth/forgot-password", () => {
  beforeEach(() => requestWithHeaders.mockReset());

  it("keeps the temporary token in httpOnly cookies, never in the body", async () => {
    requestWithHeaders.mockResolvedValue({ data: { token: "temp-token" }, message: "" });

    const res = await post({ email: "ada@lemonade.com" });
    const body = await res.json();

    expect(JSON.stringify(body)).not.toContain("temp-token");
    expect(res.cookies.get("lemonade_admin_reset_token")?.value).toBe("temp-token");
    expect(res.cookies.get("lemonade_admin_reset_token")?.httpOnly).toBe(true);
  });

  it("re-sends to the email remembered from the first request", async () => {
    requestWithHeaders.mockResolvedValue({ data: { token: "t2" }, message: "" });

    await post({}, "lemonade_admin_reset_email=ada@lemonade.com");

    expect(requestWithHeaders.mock.calls[0][0].data).toEqual({ email: "ada@lemonade.com" });
  });

  it("asks for an email when there is none", async () => {
    const res = await post({});

    expect(res.status).toBe(422);
    expect(requestWithHeaders).not.toHaveBeenCalled();
  });
});
