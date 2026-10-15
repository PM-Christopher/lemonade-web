// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const requestWithHeaders = vi.fn();

vi.mock("server-only", () => ({}));
vi.mock("@/lib/server-api", () => ({
  backendApi: { requestWithHeaders: (...args: unknown[]) => requestWithHeaders(...args) },
  persistAdminSession: vi.fn(),
  syncSignedInCookieFromHeaders: vi.fn(),
}));

const { POST } = await import("./route");

const login = async () => {
  const res = await POST(
    new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "a@b.co", password: "secret" }),
    }),
  );
  return res.json();
};

const result = {
  data: { admin: { id: 1, email: "a@b.co", name: "Ada", status: 1 }, token: "access" },
  headers: {},
};

describe("POST /api/auth/login message", () => {
  beforeEach(() => requestWithHeaders.mockReset());

  it("passes the backend's message through", async () => {
    requestWithHeaders.mockResolvedValue({ ...result, message: "Welcome back, Ada" });

    expect((await login()).message).toBe("Welcome back, Ada");
  });

  it("uses a default message when the backend's is blank", async () => {
    requestWithHeaders.mockResolvedValue({ ...result, message: "" });

    expect((await login()).message).toBe("Login successful");
  });
});
