import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@lemonade/api-client";
import { errorMessage } from "@/lib/api-error";
import { authApi } from "./api";

afterEach(() => vi.unstubAllGlobals());

describe("authApi errors", () => {
  it("keeps the server message and code when a reset is rejected", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({
          success: false,
          message: "New password cannot be the same as the current password.",
          error_code: "same-old-password",
        }),
      }),
    );

    const error = await authApi.resetPassword("Same12345#").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).errorCode).toBe("same-old-password");
    expect(errorMessage(error, "Couldn't update your password. Please try again.")).toBe(
      "New password cannot be the same as the current password.",
    );
  });
});
