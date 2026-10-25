import { describe, expect, it } from "vitest";
import { loginPathFor, safeRedirectPath } from "./redirect";

describe("safeRedirectPath", () => {
  it("keeps plain paths, with their query and hash", () => {
    expect(safeRedirectPath("/event/12")).toBe("/event/12");
    expect(safeRedirectPath("/tribe/abc?tab=members#top")).toBe("/tribe/abc?tab=members#top");
  });

  it("uses the fallback when there is nothing to return to", () => {
    expect(safeRedirectPath(null)).toBe("/");
    expect(safeRedirectPath("")).toBe("/");
    expect(safeRedirectPath(undefined, "/home")).toBe("/home");
  });

  it.each([
    "https://evil.com",
    "http://evil.com/path",
    "//evil.com",
    "///evil.com",
    "/\\evil.com",
    "\\\\evil.com",
    "/\\/evil.com",
    "javascript:alert(1)",
    "data:text/html,hi",
    "evil.com",
    "event/12",
    " /event/12",
    "/event/12\n",
    "/%2F%2Fevil.com",
    "/%5Cevil.com",
    "/%0d%0aLocation:%20https://evil.com",
    "/\t/evil.com",
    "/ok\u0000",
  ])("refuses %j", (value) => {
    expect(safeRedirectPath(value, "/safe")).toBe("/safe");
  });

  it("refuses very long values", () => {
    expect(safeRedirectPath(`/${"a".repeat(3000)}`, "/safe")).toBe("/safe");
  });

  it("refuses blocked pages and their sub paths", () => {
    expect(safeRedirectPath("/login", "/", ["/login"])).toBe("/");
    expect(safeRedirectPath("/login/extra?x=1", "/", ["/login"])).toBe("/");
    expect(safeRedirectPath("/loginhelp", "/", ["/login"])).toBe("/loginhelp");
  });
});

describe("loginPathFor", () => {
  it("remembers a safe destination", () => {
    expect(loginPathFor("/login", "/settings/wallet?x=1")).toBe(
      "/login?next=%2Fsettings%2Fwallet%3Fx%3D1",
    );
  });

  it("goes to plain login for home, unsafe values and the login page itself", () => {
    expect(loginPathFor("/login", "/")).toBe("/login");
    expect(loginPathFor("/login", "https://evil.com")).toBe("/login");
    expect(loginPathFor("/login", "/login?next=/x")).toBe("/login");
    expect(loginPathFor("/login", "/signup", ["/signup"])).toBe("/login");
  });
});
