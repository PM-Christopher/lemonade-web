import { describe, expect, it } from "vitest";
import { parseBuildOutput } from "./parse-build-output.mjs";

// A real excerpt of `next build`'s own stdout, captured from this repo —
// not hand-constructed, so it exercises the actual column spacing/units
// Next prints (kB rows, a B row, static vs dynamic glyphs, the summary
// lines that must NOT be parsed as routes).
const SAMPLE = `
Route (app)                              Size     First Load JS
┌ ƒ /                                    6.59 kB         296 kB
├ ○ /_not-found                          989 B           108 kB
├ ƒ /api/auth/login                      148 B           107 kB
├ ƒ /business                            14.7 kB         386 kB
├ ƒ /event/[id]/buy-ticket               43.4 kB         340 kB
└ ○ /wallet-management                   9.25 kB         203 kB
+ First Load JS shared by all            107 kB
  ├ chunks/803-54ec2fcbf56120e8.js       50.8 kB
  └ other shared chunks (total)          3.18 kB

ƒ Middleware                             30.4 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
`;

describe("parseBuildOutput", () => {
  it("extracts every route row with its type and both size columns", () => {
    const routes = parseBuildOutput(SAMPLE);
    expect(routes).toEqual([
      { route: "/", type: "dynamic", ownKB: 6.59, firstLoadKB: 296 },
      { route: "/_not-found", type: "static", ownKB: 0.97, firstLoadKB: 108 },
      {
        route: "/api/auth/login",
        type: "dynamic",
        ownKB: 0.14,
        firstLoadKB: 107,
      },
      { route: "/business", type: "dynamic", ownKB: 14.7, firstLoadKB: 386 },
      {
        route: "/event/[id]/buy-ticket",
        type: "dynamic",
        ownKB: 43.4,
        firstLoadKB: 340,
      },
      {
        route: "/wallet-management",
        type: "static",
        ownKB: 9.25,
        firstLoadKB: 203,
      },
    ]);
  });

  it("does not mistake the shared-chunks summary or Middleware lines for routes", () => {
    const routes = parseBuildOutput(SAMPLE);
    const routeNames = routes.map((r) => r.route);
    expect(routeNames).not.toContain("shared");
    expect(routeNames.some((r) => r.includes("chunks/"))).toBe(false);
    expect(routeNames).not.toContain("Middleware");
  });

  it("returns an empty array for input with no route table", () => {
    expect(
      parseBuildOutput("some unrelated log output\nnothing here\n"),
    ).toEqual([]);
  });
});
