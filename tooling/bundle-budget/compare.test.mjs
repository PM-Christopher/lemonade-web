import { describe, expect, it } from "vitest";
import { compare } from "./compare.mjs";

function routes(list) {
  return new Map(list.map((r) => [r.route, r]));
}

describe("compare", () => {
  it("flags a route whose First Load JS grew past tolerance", () => {
    const base = routes([{ route: "/users", firstLoadKB: 200 }]);
    const current = routes([{ route: "/users", firstLoadKB: 210 }]);

    const findings = compare({ base, current, app: "admin", toleranceKb: 2 });

    expect(findings).toEqual([
      {
        route: "/users",
        kind: "regression",
        baseKB: 200,
        currentKB: 210,
        deltaKB: 10,
      },
    ]);
  });

  it("does not flag growth within tolerance (build noise)", () => {
    const base = routes([{ route: "/users", firstLoadKB: 200 }]);
    const current = routes([{ route: "/users", firstLoadKB: 201 }]);

    expect(compare({ base, current, app: "admin", toleranceKb: 2 })).toEqual(
      [],
    );
  });

  it("does not flag a route that shrank", () => {
    const base = routes([{ route: "/users", firstLoadKB: 200 }]);
    const current = routes([{ route: "/users", firstLoadKB: 150 }]);

    expect(compare({ base, current, app: "admin", toleranceKb: 2 })).toEqual(
      [],
    );
  });

  it("judges a brand-new route against the app's absolute ceiling, not a baseline", () => {
    const base = routes([]);
    const current = routes([{ route: "/new-page", firstLoadKB: 600 }]);

    const findings = compare({ base, current, app: "admin", toleranceKb: 2 });

    expect(findings).toEqual([
      {
        route: "/new-page",
        kind: "new-route-over-budget",
        firstLoadKB: 600,
        ceiling: 500,
      },
    ]);
  });

  it("passes a brand-new route under the ceiling", () => {
    const base = routes([]);
    const current = routes([{ route: "/new-page", firstLoadKB: 400 }]);

    expect(compare({ base, current, app: "admin", toleranceKb: 2 })).toEqual(
      [],
    );
  });

  it("uses frontend's tighter public-route ceiling for PUBLIC_PATHS routes", () => {
    const base = routes([]);
    const current = routes([{ route: "/login", firstLoadKB: 250 }]);

    const findings = compare({
      base,
      current,
      app: "frontend",
      toleranceKb: 2,
    });

    expect(findings).toEqual([
      {
        route: "/login",
        kind: "new-route-over-budget",
        firstLoadKB: 250,
        ceiling: 200,
      },
    ]);
  });

  it("uses frontend's looser authenticated-route ceiling for everything else", () => {
    const base = routes([]);
    const current = routes([{ route: "/settings/wallet", firstLoadKB: 250 }]);

    expect(compare({ base, current, app: "frontend", toleranceKb: 2 })).toEqual(
      [],
    );
  });

  it("ignores a route removed this PR (present in base, absent from current)", () => {
    const base = routes([{ route: "/old-page", firstLoadKB: 200 }]);
    const current = routes([]);

    expect(compare({ base, current, app: "admin", toleranceKb: 2 })).toEqual(
      [],
    );
  });

  it("never flags an existing route on absolute size alone, only regression", () => {
    // Already over budget before this PR — pre-existing debt, not this
    // change's fault. The ratchet only turns one way.
    const base = routes([{ route: "/users", firstLoadKB: 550 }]);
    const current = routes([{ route: "/users", firstLoadKB: 551 }]);

    expect(compare({ base, current, app: "admin", toleranceKb: 2 })).toEqual(
      [],
    );
  });
});
