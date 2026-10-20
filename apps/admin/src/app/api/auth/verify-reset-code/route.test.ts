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
    new NextRequest("http://localhost/api/auth/verify-reset-code", {
      method: "POST",
      body: JSON.stringify(body),
      headers: cookie ? { cookie } : undefined,
    }),
  );

describe("POST /api/auth/verify-reset-code", () => {
  beforeEach(() => requestWithHeaders.mockReset());

  it("verifies with the temporary token and swaps it for the reset token", async () => {
    requestWithHeaders.mockResolvedValue({ data: { token: "reset-token" }, message: "" });

    const res = await post({ code: "1234" }, "lemonade_admin_reset_token=temp-token");

    expect(requestWithHeaders.mock.calls[0][0].bearerTokenOverride).toBe("temp-token");
    expect(res.cookies.get("lemonade_admin_reset_token")?.value).toBe("reset-token");
    expect(res.cookies.get("lemonade_admin_reset_code")?.value).toBe("1234");
  });

  it("says the session expired when there is no temporary token", async () => {
    const res = await post({ code: "1234" });

    expect(res.status).toBe(401);
    expect(requestWithHeaders).not.toHaveBeenCalled();
  });
});
