import { describe, expect, it, afterEach } from "vitest";
import {
  defaultFieldNames,
  defaultMessages,
  emailField,
  otpCodeField,
  passwordField,
  resetConfig,
  resetPasswordSchema,
  setConfig,
  signupSchema,
  strongPasswordField,
} from "./index";

afterEach(() => {
  resetConfig();
});

describe("emailField", () => {
  it("accepts a normal address", async () => {
    await expect(emailField.validate("ada@lemonade.africa")).resolves.toBe("ada@lemonade.africa");
  });

  it("rejects a malformed address with the shared message", async () => {
    await expect(emailField.validate("not-an-email")).rejects.toThrow("Please enter a valid email");
  });

  it("uses the configured field name when the value is empty", async () => {
    setConfig({
      messages: defaultMessages,
      fieldNames: { ...defaultFieldNames, email: "Email address" },
    });

    await expect(emailField.validate("")).rejects.toThrow("Email address is required");
  });
});

describe("password fields", () => {
  it("accepts a password that only meets the minimum length", async () => {
    await expect(passwordField().validate("password")).resolves.toBe("password");
  });

  it("rejects a short password", async () => {
    await expect(passwordField().validate("short")).rejects.toThrow(
      "Password must be at least 8 characters",
    );
  });

  it("requires mixed case, a number, and a symbol for strong passwords", async () => {
    await expect(strongPasswordField().validate("password")).rejects.toThrow(
      defaultMessages.password.strong,
    );
    await expect(strongPasswordField().validate("Password1!")).resolves.toBe("Password1!");
  });

  it("requires the confirmation to match", async () => {
    await expect(
      resetPasswordSchema.validate({
        password: "Password1!",
        confirm_password: "Other1!",
      }),
    ).rejects.toThrow("Passwords must match");
  });
});

describe("otpCodeField", () => {
  it("requires four characters", async () => {
    await expect(otpCodeField().validate("12")).rejects.toThrow("Code must be 4 characters");
    await expect(otpCodeField().validate("1583")).resolves.toBe("1583");
  });
});

describe("signupSchema", () => {
  it("accepts a complete signup", async () => {
    await expect(
      signupSchema.validate({
        fullname: "Jane Doe",
        email: "jane@lemonade.africa",
        password: "Password1!",
      }),
    ).resolves.toMatchObject({ fullname: "Jane Doe" });
  });
});
