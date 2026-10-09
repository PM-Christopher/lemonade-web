import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@lemonade/api-client";
import { DEFAULT_ERROR_CODE } from "@lemonade/api-types";
import { applyFieldErrors, errorMessage } from "./api-error";

const apiError = (message: string) =>
  new ApiError({ status: 422, errorCode: DEFAULT_ERROR_CODE, message, kind: "validation" });

describe("errorMessage", () => {
  it("returns the server message from an ApiError", () => {
    expect(errorMessage(apiError("Email already taken"), "fallback")).toBe("Email already taken");
  });

  it("falls back when the ApiError has no message", () => {
    expect(errorMessage(apiError(""), "fallback")).toBe("fallback");
  });

  it("falls back for anything that is not an ApiError", () => {
    expect(errorMessage(new Error("boom"), "fallback")).toBe("fallback");
    expect(errorMessage(undefined, "fallback")).toBe("fallback");
  });
});

describe("applyFieldErrors", () => {
  const fieldError = (fieldErrors: Record<string, string[]>) =>
    new ApiError({
      status: 422,
      errorCode: DEFAULT_ERROR_CODE,
      message: "Invalid",
      kind: "validation",
      fieldErrors,
    });

  it("puts the first server message on each known field", () => {
    const setFieldError = vi.fn();
    const applied = applyFieldErrors(
      fieldError({ email: ["Email is taken", "second"], other: ["ignored"] }),
      ["email"],
      setFieldError,
    );

    expect(applied).toBe(true);
    expect(setFieldError).toHaveBeenCalledExactlyOnceWith("email", "Email is taken");
  });

  it("reports false when no field matches or the error has no field errors", () => {
    const setFieldError = vi.fn();
    expect(applyFieldErrors(fieldError({ other: ["x"] }), ["email"], setFieldError)).toBe(false);
    expect(applyFieldErrors(new Error("boom"), ["email"], setFieldError)).toBe(false);
    expect(setFieldError).not.toHaveBeenCalled();
  });
});
