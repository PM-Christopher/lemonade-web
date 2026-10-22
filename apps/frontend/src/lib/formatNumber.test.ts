import { describe, expect, it } from "vitest";
import {
  formatMinorNaira,
  formatNaira,
  formatNairaWhole,
  formatNumberWithCommas,
  minorToNaira,
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

describe("formatMinorNaira", () => {
  it("shows kobo from the API as naira", () => {
    expect(formatMinorNaira(200000)).toBe("₦2,000");
    expect(formatMinorNaira(150050)).toBe("₦1,500.5");
    expect(formatMinorNaira(null)).toBe("₦0");
  });

  it("converts kobo to a naira number for form prefill", () => {
    expect(minorToNaira(200000)).toBe(2000);
    expect(minorToNaira(undefined)).toBe(0);
  });
});

describe("formatNairaWhole", () => {
  it("drops the decimals when the amount is whole", () => {
    expect(formatNairaWhole("2000.00")).toBe("₦2,000");
    expect(formatNairaWhole(1500000)).toBe("₦1,500,000");
  });

  it("keeps real kobo", () => {
    expect(formatNairaWhole("2000.50")).toBe("₦2,000.5");
  });
});
