import { describe, expect, it } from "vitest";
import {
  formatMoneyInput,
  formatNaira,
  formatNumberWithCommas,
  sanitizeMoneyInput,
} from "./formatNumber";

describe("formatNumberWithCommas", () => {
  it("groups thousands for numbers and numeric strings", () => {
    expect(formatNumberWithCommas(3004)).toBe("3,004");
    expect(formatNumberWithCommas("1234567")).toBe("1,234,567");
  });

  it("returns 0 for empty or non-numeric values", () => {
    expect(formatNumberWithCommas(undefined)).toBe(0);
    expect(formatNumberWithCommas("abc")).toBe(0);
  });
});

describe("formatNaira", () => {
  it("shows the naira sign, thousands separators and two decimals", () => {
    expect(formatNaira("3004.00")).toBe("₦3,004.00");
    expect(formatNaira(1500000)).toBe("₦1,500,000.00");
  });

  it("shows zero for a missing amount", () => {
    expect(formatNaira(null)).toBe("₦0.00");
  });
});

describe("money input helpers", () => {
  it.each([
    ["1a2b3", "123"],
    ["007", "7"],
    ["0.5", "0.5"],
    ["12.345", "12.34"],
    ["1.2.3", "1.23"],
    ["", ""],
  ])("sanitizes %j to %j", (typed, expected) => {
    expect(sanitizeMoneyInput(typed)).toBe(expected);
  });

  it.each([
    ["1234567", "1,234,567"],
    ["1234.5", "1,234.5"],
    ["1234.", "1,234."],
    ["999", "999"],
    ["", ""],
  ])("formats %j as %j", (raw, expected) => {
    expect(formatMoneyInput(raw)).toBe(expected);
  });
});
