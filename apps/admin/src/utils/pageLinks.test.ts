import { describe, expect, it } from "vitest";
import { pageLinks } from "./pageLinks";

describe("pageLinks", () => {
  it("keeps Overview first and the rest in alphabetical order", () => {
    expect(pageLinks[0].name).toBe("Overview");

    const rest = pageLinks.slice(1).map((link) => link.name);
    expect(rest).toEqual([...rest].sort((a, b) => a.localeCompare(b)));
  });
});
