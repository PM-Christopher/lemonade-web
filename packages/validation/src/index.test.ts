import { describe, expect, it, afterEach } from "vitest";
import type { z } from "zod";
import {
  amountField,
  contactAddressSchema,
  defaultFieldNames,
  defaultMessages,
  emailField,
  forgotPasswordSchema,
  getConfig,
  loginSchema,
  otpCodeField,
  otpSchema,
  passwordField,
  phoneNumberField,
  profileSetupSchema,
  requiredTextField,
  resetConfig,
  resetPasswordSchema,
  setConfig,
  signupSchema,
  skillsInterestsSchema,
  strongPasswordField,
} from "./index";

afterEach(() => {
  resetConfig();
});

// First error message, the one a form shows.
function firstError(schema: z.ZodType, value: unknown): string | undefined {
  const result = schema.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe("emailField", () => {
  it("accepts a normal address, trimmed", () => {
    expect(emailField.parse("  ada@lemonade.africa ")).toBe("ada@lemonade.africa");
  });

  it("rejects a malformed address with the shared message", () => {
    expect(firstError(emailField, "not-an-email")).toBe("Please enter a valid email");
  });

  it("uses the configured field name when the value is empty", () => {
    setConfig({ fieldNames: { ...defaultFieldNames, email: "Email address" } });
    expect(firstError(emailField, "")).toBe("Email address is required");
  });
});

describe("password fields", () => {
  it("accepts a password that only meets the minimum length", () => {
    expect(passwordField().parse("password")).toBe("password");
  });

  it("asks for the password when it is empty", () => {
    expect(firstError(passwordField(), "")).toBe("Password is required");
  });

  it("rejects a short password", () => {
    expect(firstError(passwordField(), "short")).toBe("Password must be at least 8 characters");
  });

  it("requires mixed case, a number, and a symbol for strong passwords", () => {
    expect(firstError(strongPasswordField(), "password")).toBe(defaultMessages.password.strong);
    expect(strongPasswordField().parse("Password1!")).toBe("Password1!");
  });

  it("requires the confirmation to match, on the confirmation field", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Password1!",
      confirm_password: "Other1!",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]).toMatchObject({
      message: "Passwords must match",
      path: ["confirm_password"],
    });
  });

  it("accepts a matching confirmation", () => {
    expect(
      resetPasswordSchema.parse({ password: "Password1!", confirm_password: "Password1!" }),
    ).toEqual({ password: "Password1!", confirm_password: "Password1!" });
  });
});

describe("otp", () => {
  it("requires four characters", () => {
    expect(firstError(otpCodeField(), "12")).toBe("Code must be 4 characters");
    expect(otpCodeField().parse("1583")).toBe("1583");
  });

  it("asks for the code when it is empty", () => {
    expect(firstError(otpSchema, { code: "" })).toBe("Code is required");
  });
});

describe("phoneNumberField", () => {
  it("accepts 10 to 15 digits with an optional plus", () => {
    expect(phoneNumberField.parse("+2348012345678")).toBe("+2348012345678");
  });

  it("rejects anything else", () => {
    expect(firstError(phoneNumberField, "12ab")).toBe("Invalid phone number");
    expect(firstError(phoneNumberField, "")).toBe("Phone number is required");
  });
});

describe("requiredTextField", () => {
  it("treats whitespace as empty", () => {
    expect(firstError(requiredTextField("city"), "   ")).toBe("City is required");
  });
});

describe("config", () => {
  it("merges partial config and resets it", () => {
    setConfig({
      messages: { ...defaultMessages, email: { ...defaultMessages.email, invalid: "Bad" } },
    });
    expect(getConfig().messages.email.invalid).toBe("Bad");
    expect(getConfig().fieldNames).toEqual(defaultFieldNames);
    resetConfig();
    expect(getConfig().messages.email.invalid).toBe(defaultMessages.email.invalid);
  });
});

describe("schemas", () => {
  it("accepts a complete signup without a referral code", () => {
    expect(
      signupSchema.parse({
        fullname: "Jane Doe",
        email: "jane@lemonade.africa",
        password: "Password1!",
      }),
    ).toMatchObject({ fullname: "Jane Doe" });
  });

  it("validates login and forgot password", () => {
    expect(loginSchema.safeParse({ email: "a@b.co", password: "password" }).success).toBe(true);
    expect(firstError(forgotPasswordSchema, { email: "" })).toBe("Email is required");
  });

  it("requires every address field", () => {
    expect(
      firstError(contactAddressSchema, { address: "1 Way", city: "", country: "NG", state: "LA" }),
    ).toBe("City is required");
  });

  it("requires bio, username and industry for profile setup", () => {
    expect(firstError(profileSetupSchema, { bio: "", username: "u", industry: "i" })).toBe(
      "Bio is required",
    );
  });

  it("requires at least three skills and three interests", () => {
    expect(
      firstError(skillsInterestsSchema, { skills: ["a", "b"], interests: ["a", "b", "c"] }),
    ).toBe("At least three skills are required");
    expect(
      skillsInterestsSchema.safeParse({ skills: ["a", "b", "c"], interests: ["a", "b", "c"] })
        .success,
    ).toBe(true);
  });
});

describe("amountField", () => {
  it("keeps a valid amount as its string, without commas", () => {
    expect(amountField().parse(" 1,500.50 ")).toBe("1500.50");
  });

  it("rejects empty, non-numeric, too many decimals and zero", () => {
    expect(firstError(amountField(), "")).toBe("Amount is required");
    expect(firstError(amountField({ label: "Price" }), "abc")).toBe(
      "Price must be a number with at most 2 decimal places",
    );
    expect(firstError(amountField(), "1.234")).toBe(
      "Amount must be a number with at most 2 decimal places",
    );
    expect(firstError(amountField(), "0")).toBe("Amount must be more than 0");
  });

  it("allows zero when asked", () => {
    expect(amountField({ allowZero: true }).parse("0")).toBe("0");
  });
});
