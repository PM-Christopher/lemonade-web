import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createApiClient, ApiError } from "./index";

describe("createApiClient", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("unwraps the success envelope to the bare data payload", async () => {
    mock.onGet("http://api.test/events").reply(200, {
      success: true,
      message: "ok",
      data: { id: "evt_1" },
    });

    const client = createApiClient({ baseURL: "http://api.test" });
    await expect(client.get("/events")).resolves.toEqual({ id: "evt_1" });
  });

  it("resolves undefined when the envelope omits data", async () => {
    mock.onPost("http://api.test/profile/logout").reply(200, {
      success: true,
      message: "logged out",
    });

    const client = createApiClient({ baseURL: "http://api.test" });
    await expect(client.post("/profile/logout")).resolves.toBeUndefined();
  });

  it("attaches the Bearer token from getToken and never a caller-supplied one", async () => {
    let seenAuth: string | undefined;
    mock.onGet("http://api.test/wallet").reply((cfg) => {
      seenAuth = cfg.headers?.Authorization as string | undefined;
      return [200, { success: true, message: "ok", data: {} }];
    });

    const client = createApiClient({ baseURL: "http://api.test", getToken: () => "real-token" });
    await client.get("/wallet", { headers: { Authorization: "Bearer spoofed" } });

    expect(seenAuth).toBe("Bearer real-token");
  });

  it("prefers an explicit bearerTokenOverride over getToken", async () => {
    let seenAuth: string | undefined;
    mock.onGet("http://api.test/otp/verify").reply((cfg) => {
      seenAuth = cfg.headers?.Authorization as string | undefined;
      return [200, { success: true, message: "ok", data: {} }];
    });

    const client = createApiClient({ baseURL: "http://api.test", getToken: () => "main-session-token" });
    await client.request({ url: "/otp/verify", method: "get", bearerTokenOverride: "scoped-verification-token" });

    expect(seenAuth).toBe("Bearer scoped-verification-token");
  });

  it("falls back to getToken when no bearerTokenOverride is given", async () => {
    let seenAuth: string | undefined;
    mock.onGet("http://api.test/wallet").reply((cfg) => {
      seenAuth = cfg.headers?.Authorization as string | undefined;
      return [200, { success: true, message: "ok", data: {} }];
    });

    const client = createApiClient({ baseURL: "http://api.test", getToken: () => "main-session-token" });
    await client.request({ url: "/wallet", method: "get" });

    expect(seenAuth).toBe("Bearer main-session-token");
  });

  it("normalizes a 422 into a validation ApiError with fieldErrors", async () => {
    mock.onPost("http://api.test/events/create-event").reply(422, {
      success: false,
      message: "The title field is required.",
      error_code: "validation-failed",
      errors: { title: ["The title field is required."] },
    });

    const client = createApiClient({ baseURL: "http://api.test" });

    await expect(client.post("/events/create-event", {})).rejects.toMatchObject({
      kind: "validation",
      status: 422,
      errorCode: "validation-failed",
      fieldErrors: { title: ["The title field is required."] },
    });
  });

  it("normalizes a network failure (no response) distinctly from a server error", async () => {
    mock.onGet("http://api.test/events").networkError();

    const client = createApiClient({ baseURL: "http://api.test" });
    await expect(client.get("/events")).rejects.toMatchObject({ kind: "network", status: 0 });
  });

  it("refreshes once on 401, retries the original request, and never surfaces the 401", async () => {
    let accessToken = "expired";
    const onRefreshed = vi.fn((newToken: string) => {
      accessToken = newToken;
    });

    mock.onPost("http://api.test/auth/refresh").reply(200, {
      success: true,
      message: "ok",
      data: { token: "fresh-token", expires_in: 900 },
    });

    mock.onGet("http://api.test/wallet").reply((cfg) => {
      return cfg.headers?.Authorization === "Bearer fresh-token"
        ? [200, { success: true, message: "ok", data: { balance: 500 } }]
        : [401, { success: false, message: "Unauthenticated.", error_code: "unauthorized" }];
    });

    const client = createApiClient({
      baseURL: "http://api.test",
      getToken: () => accessToken,
      refresh: {
        refreshPath: "/auth/refresh",
        getRefreshToken: () => "valid-refresh-token",
        onRefreshed,
      },
    });

    await expect(client.get("/wallet")).resolves.toEqual({ balance: 500 });
    expect(onRefreshed).toHaveBeenCalledWith("fresh-token", undefined, 900);
  });

  it("coalesces concurrent 401s behind a single refresh call", async () => {
    let accessToken = "expired";
    let refreshCalls = 0;

    mock.onPost("http://api.test/auth/refresh").reply(() => {
      refreshCalls += 1;
      return [200, { success: true, message: "ok", data: { token: "fresh-token" } }];
    });

    mock.onGet(/\/events\/\d/).reply((cfg) => {
      return cfg.headers?.Authorization === "Bearer fresh-token"
        ? [200, { success: true, message: "ok", data: { ok: true } }]
        : [401, { success: false, message: "Unauthenticated.", error_code: "unauthorized" }];
    });

    const client = createApiClient({
      baseURL: "http://api.test",
      getToken: () => accessToken,
      refresh: {
        refreshPath: "/auth/refresh",
        getRefreshToken: () => "valid-refresh-token",
        onRefreshed: (t) => {
          accessToken = t;
        },
      },
    });

    await Promise.all([client.get("/events/1"), client.get("/events/2"), client.get("/events/3")]);
    expect(refreshCalls).toBe(1);
  });

  it("calls onUnauthorized and rejects with ApiError when refresh itself fails", async () => {
    const onUnauthorized = vi.fn();

    mock.onPost("http://api.test/auth/refresh").reply(401, {
      success: false,
      message: "Invalid or expired refresh token",
      error_code: "unauthorized",
    });

    mock.onGet("http://api.test/wallet").reply(401, {
      success: false,
      message: "Unauthenticated.",
      error_code: "unauthorized",
    });

    const client = createApiClient({
      baseURL: "http://api.test",
      getToken: () => "expired",
      refresh: {
        refreshPath: "/auth/refresh",
        getRefreshToken: () => "stale-refresh-token",
        onRefreshed: () => {},
      },
      onUnauthorized,
    });

    await expect(client.get("/wallet")).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it("skips refresh entirely and calls onUnauthorized directly when no refresh is configured (admin today)", async () => {
    const onUnauthorized = vi.fn();
    mock.onGet("http://api.test/admin/dashboard").reply(401, {
      success: false,
      message: "Unauthenticated.",
      error_code: "unauthorized",
    });

    const client = createApiClient({ baseURL: "http://api.test", getToken: () => "token", onUnauthorized });

    await expect(client.get("/admin/dashboard")).rejects.toMatchObject({ kind: "auth", status: 401 });
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });
});
