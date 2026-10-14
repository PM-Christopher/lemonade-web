import { describe, expect, it } from "vitest";
import { checkError, handleTest } from "./checkError";

describe("checkError", () => {
  it("returns the error message for a touched field with an error", () => {
    const form = {
      touched: { email: true },
      errors: { email: "Email is required" },
    };
    expect(checkError("email", form)).toBe("Email is required");
  });

  it("returns a falsy value when the field hasn't been touched", () => {
    const form = {
      touched: {},
      errors: { email: "Email is required" },
    };
    expect(checkError("email", form)).toBeFalsy();
  });

  it("returns null for a field it doesn't know about", () => {
    const form = { touched: { unknown_field: true }, errors: { unknown_field: "x" } };
    expect(checkError("unknown_field", form)).toBeNull();
  });
});

describe("handleTest", () => {
  const form = { values: { password: "Abcdef1!" } };

  it("checks each password requirement independently", () => {
    expect(handleTest("lower", form)).toBe(true);
    expect(handleTest("upper", form)).toBe(true);
    expect(handleTest("number", form)).toBe(true);
    expect(handleTest("special", form)).toBe(true);
    expect(handleTest("eight", form)).toBe(true);
  });

  it("fails a requirement the password doesn't meet", () => {
    expect(handleTest("special", { values: { password: "abcdefgh" } })).toBe(false);
    expect(handleTest("eight", { values: { password: "abc" } })).toBe(false);
  });
});
