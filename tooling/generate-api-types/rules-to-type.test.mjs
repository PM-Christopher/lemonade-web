import { describe, expect, it } from "vitest";
import { inferFieldType, isOptional, isNullable } from "./rules-to-type.mjs";

describe("inferFieldType", () => {
  it("maps common Laravel rule tokens to TS types", () => {
    expect(inferFieldType(["required", "string"])).toBe("string");
    expect(inferFieldType(["nullable", "integer"])).toBe("number");
    expect(inferFieldType(["required", "boolean"])).toBe("boolean");
    expect(inferFieldType(["sometimes", "array"])).toBe("unknown[]");
    expect(inferFieldType(["required", "email"])).toBe("string");
    expect(inferFieldType(["required", "uuid"])).toBe("string");
  });

  it("turns in:a,b,c into a string-literal union", () => {
    expect(inferFieldType(["required", "in:draft,published,archived"])).toBe(
      '"draft" | "published" | "archived"',
    );
  });

  it("falls through to unknown for an unrecognized rule", () => {
    expect(inferFieldType(["required", "unlimitedstock"])).toBe("unknown");
  });

  it("prefers the first recognized base type when several are present", () => {
    // "password" is itself a token (a custom rule class basename) as well
    // as a type-bearing rule in the map — string is still correct either way.
    expect(inferFieldType(["required", "string", "password"])).toBe("string");
  });
});

describe("isOptional", () => {
  it("is optional for sometimes/nullable/required_if-family rules", () => {
    expect(isOptional(["sometimes", "string"])).toBe(true);
    expect(isOptional(["nullable", "string"])).toBe(true);
    expect(isOptional(["required_if:type,admin", "string"])).toBe(true);
  });

  it("is not optional for a plain required field", () => {
    expect(isOptional(["required", "string"])).toBe(false);
  });
});

describe("isNullable", () => {
  it("is true only when the nullable token is present", () => {
    expect(isNullable(["nullable", "string"])).toBe(true);
    expect(isNullable(["required", "string"])).toBe(false);
  });
});
