import { describe, expect, it } from "vitest";
import { countUnread, formatBadgeCount } from "./unread";

describe("countUnread", () => {
  it("counts only notifications without read_at", () => {
    expect(
      countUnread([
        { id: "1", read_at: null },
        { id: "2", read_at: "2026-10-16T01:00:00Z" },
        { id: "3" },
      ]),
    ).toBe(2);
  });

  it("returns 0 while the list is loading", () => {
    expect(countUnread(undefined)).toBe(0);
  });
});

describe("formatBadgeCount", () => {
  it("caps large counts", () => {
    expect(formatBadgeCount(7)).toBe("7");
    expect(formatBadgeCount(100)).toBe("99+");
  });
});
