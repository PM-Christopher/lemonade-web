import { describe, expect, it } from "vitest";
import { formatCount } from "./formatNumber";

describe("formatCount", () => {
  it("adds thousands commas to numbers and numeric strings", () => {
    expect(formatCount(1234567)).toBe("1,234,567");
    expect(formatCount("2490000.50")).toBe("2,490,000.5");
  });

  it("shows 0 when there is no value", () => {
    expect(formatCount(undefined)).toBe("0");
    expect(formatCount(null)).toBe("0");
  });
});
