import { describe, expect, it } from "vitest";
import { DEFAULT_ERROR_CODE } from "./index";

describe("DEFAULT_ERROR_CODE", () => {
  it("matches the backend's fallback error code", () => {
    expect(DEFAULT_ERROR_CODE).toBe("not-specified");
  });
});
