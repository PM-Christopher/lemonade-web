import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast.mjs";

const WHITE = { h: 0, s: 0, l: 100 };
const BLACK = { h: 0, s: 0, l: 0 };

describe("contrastRatio", () => {
  it("is 21:1 for pure black on pure white — WCAG's known maximum", () => {
    expect(contrastRatio(BLACK, WHITE)).toBeCloseTo(21, 1);
  });

  it("is 1:1 for a color against itself", () => {
    const color = { h: 210, s: 50, l: 40 };
    expect(contrastRatio(color, color)).toBeCloseTo(1, 5);
  });

  it("is symmetric — order of the two tokens doesn't matter", () => {
    const a = { h: 0, s: 0, l: 20 };
    const b = { h: 0, s: 0, l: 90 };
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
  });

  it("matches the real light-mode destructive-on-destructive failure this audit found", () => {
    // --destructive: 0 84.2% 60.2%; --destructive-foreground: 0 0% 98%
    const destructive = { h: 0, s: 84.2, l: 60.2 };
    const destructiveForeground = { h: 0, s: 0, l: 98 };
    const ratio = contrastRatio(destructiveForeground, destructive);
    expect(ratio).toBeLessThan(4.5);
    expect(ratio).toBeCloseTo(3.6, 1);
  });
});
