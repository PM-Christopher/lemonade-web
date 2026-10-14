import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@lemonade/api-client";
import { DEFAULT_ERROR_CODE } from "@lemonade/api-types";
import { applyServerErrors } from "./form-errors";

const fieldError = (fieldErrors: Record<string, string[]>) =>
  new ApiError({
    status: 422,
    errorCode: DEFAULT_ERROR_CODE,
    message: "Invalid",
    kind: "validation",
    fieldErrors,
  });

describe("applyServerErrors", () => {
  it("puts the first server message on each field the form has", () => {
    const setError = vi.fn();
    const applied = applyServerErrors<{ email: string }>(
      fieldError({ email: ["Email is taken", "second"], other: ["ignored"] }),
      setError,
      ["email"],
    );

    expect(applied).toBe(true);
    expect(setError).toHaveBeenCalledExactlyOnceWith("email", {
      type: "server",
      message: "Email is taken",
    });
  });

  it("reports false when no field matches or there are no field errors", () => {
    const setError = vi.fn();
    expect(applyServerErrors(fieldError({ other: ["x"] }), setError, ["email"])).toBe(false);
    expect(applyServerErrors(new Error("boom"), setError, ["email"])).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });
});
