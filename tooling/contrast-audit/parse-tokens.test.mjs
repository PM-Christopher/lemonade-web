import { describe, expect, it } from "vitest";
import { parseTokens } from "./parse-tokens.mjs";

// Regression test for a real bug: globals.css has an EARLIER, unrelated
// `:root { --foreground-rgb: 0, 0, 0; ... }` block (legacy, comma-separated
// RGB triplets, not space-separated HSL) before @layer base's real shadcn
// token block. An earlier version of parseTokens matched that first :root
// and silently returned an empty token set — audit.mjs printed "missing
// token(s)" for every single pair without erroring. This fixture
// reproduces that exact shape.
const FIXTURE_CSS = `
:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
  }
}
`;

describe("parseTokens", () => {
  it("reads the @layer base token block, not an earlier unrelated :root", () => {
    const { light } = parseTokens(FIXTURE_CSS);

    expect(light.background).toEqual({ h: 0, s: 0, l: 100 });
    expect(light.foreground).toEqual({ h: 0, s: 0, l: 3.9 });
  });

  it("does not pick up the legacy comma-separated --foreground-rgb value", () => {
    const { light } = parseTokens(FIXTURE_CSS);
    expect(light["foreground-rgb"]).toBeUndefined();
  });

  it("ignores non-HSL declarations like --radius", () => {
    const { light } = parseTokens(FIXTURE_CSS);
    expect(light.radius).toBeUndefined();
  });

  it("parses the .dark block separately from :root", () => {
    const { dark } = parseTokens(FIXTURE_CSS);
    expect(dark.background).toEqual({ h: 0, s: 0, l: 3.9 });
    expect(dark.foreground).toEqual({ h: 0, s: 0, l: 98 });
  });
});
