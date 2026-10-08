import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@lemonade/api-client";
import { DEFAULT_ERROR_CODE } from "@lemonade/api-types";
import { signup } from "./authApi";
import { routes } from "@/lib/routes";

const register = vi.fn();
vi.mock("./api", () => ({ authApi: { register: (...args: unknown[]) => register(...args) } }));

const values = { fullname: "Ada Lovelace", email: "ada@example.com", password: "Secret123!" };

describe("signup", () => {
  const dispatch = vi.fn();
  const push = vi.fn();
  const setCookie = vi.fn();

  beforeEach(() => {
    register.mockReset();
    dispatch.mockReset();
    push.mockReset();
    setCookie.mockReset();
  });

  it("stores the onboarding token and sends the user to verify their email", async () => {
    register.mockResolvedValue({ user: { id: 1 }, token: "onboarding-token", token_type: "x" });

    await signup(values, dispatch, { push }, setCookie);

    expect(register).toHaveBeenCalledWith(values);
    expect(setCookie).toHaveBeenCalledWith("newToken", "onboarding-token", expect.any(Object));
    expect(push).toHaveBeenCalledWith(routes.VERIFY_EMAIL);
  });

  it("shows the server's message when signup is rejected", async () => {
    register.mockRejectedValue(
      new ApiError({
        status: 400,
        errorCode: DEFAULT_ERROR_CODE,
        message: "Email account already exists. Login to continue",
        kind: "validation",
      }),
    );

    await signup(values, dispatch, { push }, setCookie);

    expect(push).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          message: "Email account already exists. Login to continue",
          type: "error",
        }),
      }),
    );
  });
});
