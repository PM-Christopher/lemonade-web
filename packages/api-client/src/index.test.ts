import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createApiClient, ApiError, getSetCookieValue } from "./index";

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

    const client = createApiClient({
      baseURL: "http://api.test",
      getToken: () => "main-session-token",
    });
    await client.request({
      url: "/otp/verify",
      method: "get",
      bearerTokenOverride: "scoped-verification-token",
    });

    expect(seenAuth).toBe("Bearer scoped-verification-token");
  });

  it("falls back to getToken when no bearerTokenOverride is given", async () => {
    let seenAuth: string | undefined;
    mock.onGet("http://api.test/wallet").reply((cfg) => {
      seenAuth = cfg.headers?.Authorization as string | undefined;
      return [200, { success: true, message: "ok", data: {} }];
    });

    const client = createApiClient({
      baseURL: "http://api.test",
      getToken: () => "main-session-token",
    });
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

    const client = createApiClient({
      baseURL: "http://api.test",
      getToken: () => "token",
      onUnauthorized,
    });

    await expect(client.get("/admin/dashboard")).rejects.toMatchObject({
      kind: "auth",
      status: 401,
    });
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it("requestWithHeaders keeps the raw response headers alongside the unwrapped data", async () => {
    // A plain string here, not an array — axios-mock-adapter's own reply()
    // typing only accepts single string header values. Real multi-Set-
    // Cookie-header array handling is covered separately and directly by
    // getSetCookieValue's own tests below, which don't go through this
    // mock library at all.
    mock
      .onGet("http://api.test/wallet")
      .reply(
        200,
        { success: true, message: "ok", data: { balance: 500 } },
        { "set-cookie": "lemonade-network-signed-in=1; Path=/; HttpOnly" },
      );

    const client = createApiClient({ baseURL: "http://api.test" });
    const result = await client.requestWithHeaders<{ balance: number }>({
      url: "/wallet",
      method: "get",
    });

    expect(result.data).toEqual({ balance: 500 });
    expect(result.headers["set-cookie"]).toEqual("lemonade-network-signed-in=1; Path=/; HttpOnly");
  });

  it("reports the message of a successful write, but not of a read", async () => {
    mock
      .onGet("http://api.test/wallet")
      .reply(200, { success: true, message: "Wallet loaded", data: {} });
    mock
      .onPost("http://api.test/wallet/fund")
      .reply(200, { success: true, message: "Wallet funded", data: {} });
    const onSuccessMessage = vi.fn();

    const client = createApiClient({ baseURL: "http://api.test", onSuccessMessage });
    await client.get("/wallet");
    expect(onSuccessMessage).not.toHaveBeenCalled();

    await client.post("/wallet/fund", {});
    expect(onSuccessMessage).toHaveBeenCalledExactlyOnceWith("Wallet funded");
  });

  it("returns the envelope message from requestWithHeaders", async () => {
    mock
      .onGet("http://api.test/wallet")
      .reply(200, { success: true, message: "Wallet loaded", data: {} });

    const client = createApiClient({ baseURL: "http://api.test" });
    const raw = await client.requestWithHeaders({ url: "/wallet", method: "get" });

    expect(raw.message).toBe("Wallet loaded");
  });

  it("returns a blank message from requestWithHeaders when the envelope has none", async () => {
    mock.onGet("http://api.test/wallet").reply(200, { success: true, data: {} });

    const client = createApiClient({ baseURL: "http://api.test" });
    const raw = await client.requestWithHeaders({ url: "/wallet", method: "get" });

    expect(raw.message).toBe("");
  });
});

describe("createApiClient — error normalization", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it.each([
    [403, "permission"],
    [404, "notFound"],
    [409, "conflict"],
    [429, "rateLimit"],
    [500, "server"],
    [418, "server"],
  ] as const)("maps HTTP %i to kind %s", async (status, kind) => {
    mock.onGet("http://api.test/thing").reply(status, {
      success: false,
      message: "Nope",
      error_code: "not-found",
    });

    const client = createApiClient({ baseURL: "http://api.test" });
    const error = await client.get("/thing").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status, kind, errorCode: "not-found", message: "Nope" });
  });

  it("falls back to a default code and message when the body has neither", async () => {
    mock.onGet("http://api.test/thing").reply(500, {});

    const client = createApiClient({ baseURL: "http://api.test" });
    const error = await client.get("/thing").catch((e: unknown) => e);

    expect(error).toMatchObject({ errorCode: "not-specified", message: "Something went wrong." });
  });

  it("normalizes a timeout distinctly from a network failure", async () => {
    mock.onGet("http://api.test/slow").timeout();

    const client = createApiClient({ baseURL: "http://api.test" });
    const error = await client.get("/slow").catch((e: unknown) => e);

    expect(error).toMatchObject({ status: 0, kind: "timeout", message: "Request timed out." });
  });

  it("keeps the backend's correlation id on the error", async () => {
    mock
      .onGet("http://api.test/thing")
      .reply(500, { message: "Boom" }, { "x-correlation-id": "cid-9" });
    const seen: string[] = [];

    const client = createApiClient({
      baseURL: "http://api.test",
      onCorrelationId: (id) => seen.push(id),
    });
    const error = await client.get("/thing").catch((e: unknown) => e);

    expect(error).toMatchObject({ correlationId: "cid-9" });
    expect(seen.at(-1)).toBe("cid-9");
  });
});

describe("createApiClient — methods and correlation ids", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("unwraps patch, put, delete and request the same way as get", async () => {
    const ok = (data: unknown) => [200, { success: true, message: "ok", data }] as const;
    mock.onPatch("http://api.test/a").reply(...ok("patched"));
    mock.onPut("http://api.test/a").reply(...ok("put"));
    mock.onDelete("http://api.test/a").reply(...ok("deleted"));
    mock.onGet("http://api.test/b").reply(...ok("requested"));

    const client = createApiClient({ baseURL: "http://api.test" });

    await expect(client.patch("/a", {})).resolves.toBe("patched");
    await expect(client.put("/a", {})).resolves.toBe("put");
    await expect(client.delete("/a")).resolves.toBe("deleted");
    await expect(client.request({ method: "GET", url: "/b" })).resolves.toBe("requested");
  });

  it("forwards an inbound correlation id and reports the backend's echo", async () => {
    let sent: string | undefined;
    mock.onGet("http://api.test/c").reply((cfg) => {
      sent = cfg.headers?.["X-Correlation-Id"] as string | undefined;
      return [200, { success: true, message: "ok", data: null }, { "x-correlation-id": "echoed" }];
    });
    const seen: string[] = [];

    const client = createApiClient({
      baseURL: "http://api.test",
      getCorrelationId: () => "inbound",
      onCorrelationId: (id) => seen.push(id),
    });
    await client.get("/c");

    expect(sent).toBe("inbound");
    expect(seen).toEqual(["inbound", "echoed"]);
  });

  it("mints a correlation id when none is passed in", async () => {
    let sent: string | undefined;
    mock.onGet("http://api.test/c").reply((cfg) => {
      sent = cfg.headers?.["X-Correlation-Id"] as string | undefined;
      return [200, { success: true, message: "ok", data: null }];
    });

    await createApiClient({ baseURL: "http://api.test" }).get("/c");

    expect(sent).toMatch(/^[0-9a-f-]{36}$/);
  });
});

describe("createApiClient — refresh edge cases", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("gives up without calling refresh when there is no refresh token", async () => {
    mock.onGet("http://api.test/me").reply(401, { message: "Unauthenticated." });
    const onUnauthorized = vi.fn();

    const client = createApiClient({
      baseURL: "http://api.test",
      refresh: {
        refreshPath: "/auth/refresh",
        getRefreshToken: () => undefined,
        onRefreshed: vi.fn(),
      },
      onUnauthorized,
    });
    const error = await client.get("/me").catch((e: unknown) => e);

    expect(error).toMatchObject({ status: 401, kind: "auth" });
    expect(onUnauthorized).toHaveBeenCalledOnce();
    expect(mock.history.post).toHaveLength(0);
  });

  it("treats a refresh response without a token as a failed refresh", async () => {
    mock.onGet("http://api.test/me").reply(401, { message: "Unauthenticated." });
    mock
      .onPost("http://api.test/auth/refresh")
      .reply(200, { success: true, message: "ok", data: {} });
    const onRefreshed = vi.fn();
    const onUnauthorized = vi.fn();

    const client = createApiClient({
      baseURL: "http://api.test",
      refresh: {
        refreshPath: "/auth/refresh",
        getRefreshToken: () => "refresh-1",
        onRefreshed,
      },
      onUnauthorized,
    });
    const error = await client.get("/me").catch((e: unknown) => e);

    expect(error).toMatchObject({ status: 401, kind: "auth" });
    expect(onRefreshed).not.toHaveBeenCalled();
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });
});

describe("getSetCookieValue", () => {
  it("returns the cookie's value when present", () => {
    const headers = { "set-cookie": ["lemonade-network-signed-in=1; Path=/; HttpOnly"] };
    expect(getSetCookieValue(headers, "lemonade-network-signed-in")).toBe("1");
  });

  it("returns an empty string for a cleared cookie, not undefined", () => {
    const headers = {
      "set-cookie": ["lemonade-network-signed-in=; expires=Thu, 01 Jan 1970 00:00:00 GMT"],
    };
    expect(getSetCookieValue(headers, "lemonade-network-signed-in")).toBe("");
  });

  it("returns undefined when the header never mentions this cookie", () => {
    const headers = { "set-cookie": ["some_other_cookie=abc; Path=/"] };
    expect(getSetCookieValue(headers, "lemonade-network-signed-in")).toBeUndefined();
  });

  it("returns undefined when there is no set-cookie header at all", () => {
    expect(getSetCookieValue({}, "lemonade-network-signed-in")).toBeUndefined();
  });

  it("handles a single string set-cookie header, not just an array", () => {
    const headers = { "set-cookie": "lemonade-network-signed-in=1; Path=/" };
    expect(getSetCookieValue(headers, "lemonade-network-signed-in")).toBe("1");
  });

  it("finds the right cookie among several Set-Cookie lines", () => {
    const headers = {
      "set-cookie": ["some_other=xyz; Path=/", "lemonade-network-signed-in=1; Path=/"],
    };
    expect(getSetCookieValue(headers, "lemonade-network-signed-in")).toBe("1");
  });
});
