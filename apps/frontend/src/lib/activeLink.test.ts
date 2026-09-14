import { describe, expect, it } from "vitest";
import { isActiveLink } from "./activeLink";

describe("isActiveLink", () => {
    it("matches exactly when exact is true and path is the root", () => {
        expect(isActiveLink("/", "/", true)).toBe(true);
        expect(isActiveLink("/event", "/", true)).toBe(false);
    });

    it("falls back to substring matching otherwise", () => {
        expect(isActiveLink("/event/123", "/event", true)).toBe(true);
        expect(isActiveLink("/tribe/123", "/tribe")).toBe(true);
        expect(isActiveLink("/settings", "/tribe")).toBe(false);
    });
});
