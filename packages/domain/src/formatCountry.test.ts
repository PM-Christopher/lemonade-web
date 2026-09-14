import { describe, expect, it } from "vitest";
import { formatCountry } from "./formatCountry";

describe("formatCountry", () => {
  it("converts a known country name to its ISO alpha-2 code", () => {
    expect(formatCountry("Nigeria")).toBe("NG");
    expect(formatCountry("United States of America (the)")).toBe("US");
  });

  it("returns null for an empty or unknown country name", () => {
    expect(formatCountry("")).toBeNull();
    expect(formatCountry("Not A Real Country")).toBeNull();
  });
});
