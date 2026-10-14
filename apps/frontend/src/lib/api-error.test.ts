import { describe, expect, it } from "vitest";
import { ApiError } from "@lemonade/api-client";
import { DEFAULT_ERROR_CODE } from "@lemonade/api-types";
import { errorMessage } from "./api-error";

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
