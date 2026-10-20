// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requestWithHeaders = vi.fn();

vi.mock("server-only", () => ({}));
vi.mock("@/lib/server-api", () => ({
  backendApi: { requestWithHeaders: (...args: unknown[]) => requestWithHeaders(...args) },
}));

const { POST } = await import("./route");

const post = (cookie?: string) =>
  POST(
    new NextRequest("http://localhost/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ password: "Str0ng!Passw0rd#1" }),
      headers: cookie ? { cookie } : undefined,
    }),
  );

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => requestWithHeaders.mockReset());

  it("sends the saved code with the new password, then clears the reset cookies", async () => {
    requestWithHeaders.mockResolvedValue({ data: {}, message: "" });

    const res = await post(
      "lemonade_admin_reset_token=reset-token; lemonade_admin_reset_code=1234",
    );

    expect(requestWithHeaders.mock.calls[0][0]).toMatchObject({
      data: { code: "1234", password: "Str0ng!Passw0rd#1" },
      bearerTokenOverride: "reset-token",
    });
    expect(res.cookies.get("lemonade_admin_reset_token")?.value).toBe("");
    expect(res.cookies.get("lemonade_admin_reset_code")?.value).toBe("");
  });

  it("says the session expired when the verified code is missing", async () => {
    const res = await post("lemonade_admin_reset_token=reset-token");

    expect(res.status).toBe(401);
    expect(requestWithHeaders).not.toHaveBeenCalled();
  });
});
