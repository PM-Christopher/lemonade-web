import { describe, expect, it } from "vitest";
import { formatNotificationTime } from "./format";

describe("formatNotificationTime", () => {
  it("shows the date and time", () => {
    expect(formatNotificationTime("2026-10-26T16:05:00")).toBe("26 Oct, 4:05 PM");
  });

  it("shows nothing for a missing value or text that is not a date", () => {
    expect(formatNotificationTime(undefined)).toBe("");
    expect(formatNotificationTime("3h ago")).toBe("");
  });
});
