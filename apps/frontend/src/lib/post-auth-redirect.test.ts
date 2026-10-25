import { beforeEach, describe, expect, it } from "vitest";
import {
  loginPathWithNext,
  readNext,
  rememberNext,
  takeRememberedNext,
  withNext,
} from "./post-auth-redirect";

beforeEach(() => {
  document.cookie = "lemonade_next=; path=/; max-age=0";
});

describe("readNext", () => {
  it("accepts in-app paths and falls back to home", () => {
    expect(readNext("/event/9?tab=tickets")).toBe("/event/9?tab=tickets");
    expect(readNext("https://evil.com")).toBe("/");
    expect(readNext("/\\evil.com")).toBe("/");
    expect(readNext("//evil.com")).toBe("/");
    expect(readNext(null)).toBe("/");
  });

  it("never sends someone back to an auth page", () => {
    expect(readNext("/login?next=/x")).toBe("/");
    expect(readNext("/signup")).toBe("/");
    expect(readNext("/verify-email")).toBe("/");
  });
});

describe("loginPathWithNext", () => {
  it("remembers where the visitor was headed", () => {
    expect(loginPathWithNext("/settings/wallet")).toBe("/login?next=%2Fsettings%2Fwallet");
    expect(loginPathWithNext("https://evil.com")).toBe("/login");
  });
});

describe("withNext", () => {
  it("carries the destination to the sign up link", () => {
    expect(withNext("/signup", "/tribe/abc")).toBe("/signup?next=%2Ftribe%2Fabc");
    expect(withNext("/signup", "https://evil.com")).toBe("/signup");
  });
});

describe("remembered destination", () => {
  it("survives onboarding once, then clears", () => {
    rememberNext("/event/9");

    expect(takeRememberedNext()).toBe("/event/9");
    expect(takeRememberedNext()).toBe("/");
  });

  it("does not store home or unsafe values", () => {
    rememberNext("/");
    rememberNext("https://evil.com");

    expect(takeRememberedNext()).toBe("/");
  });

  it("ignores a tampered cookie", () => {
    document.cookie = `lemonade_next=${encodeURIComponent("https://evil.com")}; path=/`;

    expect(takeRememberedNext()).toBe("/");
  });
});
