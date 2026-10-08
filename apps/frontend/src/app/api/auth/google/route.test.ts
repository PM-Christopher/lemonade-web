// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@lemonade/api-client";

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

const post = (body: unknown) =>
  POST(
    new Request("http://localhost/api/auth/google", { method: "POST", body: JSON.stringify(body) }),
  );

const finishedUser = { id: 1, email: "a@b.co", fullname: "Ada", username: "ada", status: 1 };

describe("POST /api/auth/google", () => {
  beforeEach(() => {
    requestWithHeaders.mockReset();
    persistUserSession.mockReset();
    syncSignedInCookieFromHeaders.mockReset();
  });

  it("stores the session server-side and never returns the token for a finished account", async () => {
    requestWithHeaders.mockResolvedValue({
      data: {
        user: finishedUser,
        token: "access",
        refresh_token: "refresh",
        expires_in: 3600,
        token_type: "access",
      },
      headers: {},
    });

    const res = await post({ token: "google-token" });
    const body = await res.json();

    expect(persistUserSession).toHaveBeenCalledWith("access", "refresh", 3600);
    expect(body.data).toEqual({ user: finishedUser });
  });

  it("returns the onboarding token without starting a session for an unfinished account", async () => {
    requestWithHeaders.mockResolvedValue({
      data: {
        user: { ...finishedUser, username: null },
        token: "verify",
        token_type: "account_verification_token",
      },
      headers: {},
    });

    const body = await (await post({ token: "google-token" })).json();

    expect(persistUserSession).not.toHaveBeenCalled();
    expect(body.data).toMatchObject({ token: "verify", needsOnboarding: true });
  });

  it("passes the backend's error through", async () => {
    requestWithHeaders.mockRejectedValue(
      new ApiError({
        status: 409,
        errorCode: "not-specified",
        message: "Account exists with email/password. Sign in with password instead.",
        kind: "conflict",
      }),
    );

    const res = await post({ token: "google-token" });

    expect(res.status).toBe(409);
    expect((await res.json()).message).toMatch(/Sign in with password/);
  });

  it("rejects a request without a Google token", async () => {
    expect((await post({})).status).toBe(422);
    expect(requestWithHeaders).not.toHaveBeenCalled();
  });
});
