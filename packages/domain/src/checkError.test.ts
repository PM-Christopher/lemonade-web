import { describe, expect, it } from "vitest";
import { checkError, handleTest } from "./checkError";

describe("checkError", () => {
  it("returns the error message for a touched field with an error", () => {
    const formik = {
      touched: { email: true },
      errors: { email: "Email is required" },
    };
    expect(checkError("email", formik)).toBe("Email is required");
  });

  it("returns a falsy value when the field hasn't been touched", () => {
    const formik = {
      touched: {},
      errors: { email: "Email is required" },
    };
    expect(checkError("email", formik)).toBeFalsy();
  });

  it("returns null for a field it doesn't know about", () => {
    const formik = { touched: { unknown_field: true }, errors: { unknown_field: "x" } };
    expect(checkError("unknown_field", formik)).toBeNull();
  });
});

describe("handleTest", () => {
  const formik = { values: { password: "Abcdef1!" } };

  it("checks each password requirement independently", () => {
    expect(handleTest("lower", formik)).toBe(true);
    expect(handleTest("upper", formik)).toBe(true);
    expect(handleTest("number", formik)).toBe(true);
    expect(handleTest("special", formik)).toBe(true);
    expect(handleTest("eight", formik)).toBe(true);
  });

  it("fails a requirement the password doesn't meet", () => {
    expect(handleTest("special", { values: { password: "abcdefgh" } })).toBe(false);
    expect(handleTest("eight", { values: { password: "abc" } })).toBe(false);
  });
});
