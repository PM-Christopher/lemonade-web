import { describe, expect, it } from "vitest";
import { notificationIconKind } from "./NotificationIcon";

describe("notificationIconKind", () => {
  it("uses a different icon per context", () => {
    expect(notificationIconKind("connect")).toBe("globe");
    expect(notificationIconKind("connect_response")).toBe("globe");
    expect(notificationIconKind("thread")).toBe("chat");
    expect(notificationIconKind("tribe")).toBe("chat");
    expect(notificationIconKind("event")).toBe("calendar");
    expect(notificationIconKind("report")).toBe("flag");
  });

  it("falls back to the bell for unknown or missing types", () => {
    expect(notificationIconKind("something-new")).toBe("bell");
    expect(notificationIconKind(undefined)).toBe("bell");
  });
});
