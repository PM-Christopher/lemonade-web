import { describe, expect, it } from "vitest";
import { loginPathWithNext, readNext } from "./post-auth-redirect";

describe("readNext", () => {
  it("accepts console paths and falls back to home", () => {
    expect(readNext("/disputes/abc?x=1")).toBe("/disputes/abc?x=1");
    expect(readNext("https://evil.com")).toBe("/");
    expect(readNext("/\\evil.com")).toBe("/");
    expect(readNext("//evil.com")).toBe("/");
    expect(readNext(null)).toBe("/");
  });

  it("does not return to a login page", () => {
    expect(readNext("/login")).toBe("/");
    expect(readNext("/reset-password")).toBe("/");
  });
});

describe("loginPathWithNext", () => {
  it("keeps where the admin was headed", () => {
    expect(loginPathWithNext("/audit-log?page=2")).toBe("/login?next=%2Faudit-log%3Fpage%3D2");
    expect(loginPathWithNext("/")).toBe("/login");
    expect(loginPathWithNext("https://evil.com")).toBe("/login");
  });
});
