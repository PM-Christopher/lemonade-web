import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "./logger";

describe("logger", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("emits info and warn through console.warn as structured JSON", () => {
    logger.info("cache warmed", { route: "/event" });

    expect(errorSpy).not.toHaveBeenCalled();
    const entry = JSON.parse(warnSpy.mock.calls[0][0] as string);
    expect(entry).toMatchObject({ level: "info", message: "cache warmed", context: { route: "/event" } });
    expect(typeof entry.timestamp).toBe("string");
  });

  it("emits error through console.error", () => {
    logger.error("refresh failed", { status: 401 });

    expect(warnSpy).not.toHaveBeenCalled();
    const entry = JSON.parse(errorSpy.mock.calls[0][0] as string);
    expect(entry).toMatchObject({ level: "error", message: "refresh failed", context: { status: 401 } });
  });

  it("redacts sensitive keys at the top level and nested", () => {
    logger.warn("login attempt", {
      email: "user@example.com",
      password: "hunter2",
      nested: { token: "abc123", ok: true },
    });

    const entry = JSON.parse(warnSpy.mock.calls[0][0] as string);
    expect(entry.context).toEqual({
      email: "user@example.com",
      password: "[REDACTED]",
      nested: { token: "[REDACTED]", ok: true },
    });
  });

  it("redacts sensitive keys inside arrays of objects", () => {
    logger.warn("batch", {
      items: [{ otp: "1234" }, { name: "ok" }],
    });

    const entry = JSON.parse(warnSpy.mock.calls[0][0] as string);
    expect(entry.context).toEqual({
      items: [{ otp: "[REDACTED]" }, { name: "ok" }],
    });
  });

  it("omits the context key entirely when no context is passed", () => {
    logger.info("no context here");

    const entry = JSON.parse(warnSpy.mock.calls[0][0] as string);
    expect(entry).not.toHaveProperty("context");
  });
});
