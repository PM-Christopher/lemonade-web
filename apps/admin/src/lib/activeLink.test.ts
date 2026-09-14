import { describe, expect, it } from "vitest";
import { isActiveLink } from "./activeLink";

describe("isActiveLink", () => {
  it("matches exactly when exact is true", () => {
    expect(isActiveLink("/events", "/events", true)).toBe(true);
    expect(isActiveLink("/events/123", "/events", true)).toBe(false);
  });

  it("matches by substring when exact is false", () => {
    expect(isActiveLink("/events/123", "/events")).toBe(true);
    expect(isActiveLink("/users", "/events")).toBe(false);
  });
});
