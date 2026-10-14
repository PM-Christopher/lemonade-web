import { z } from "zod";
import { getConfig } from "../config";
import type { FieldNames } from "../config";

/** Mirrors `App\Support\PasswordRules::strong()`. */
const STRONG_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~])(?=.{8,})/;

// Messages are read at validation time, so setConfig() applies to schemas built earlier.
const requiredMessage = (field: keyof FieldNames) => () =>
  `${getConfig().fieldNames[field]} is required`;

export const requiredTextField = (field: keyof FieldNames) =>
  z
    .string()
    .trim()
    .min(1, { error: requiredMessage(field) });

export const optionalTextField = () => z.string().trim().optional();

export const emailField = z
  .string()
  .trim()
  .min(1, { error: requiredMessage("email") })
  .email({ error: () => getConfig().messages.email.invalid });

/** Login and other screens that only ask for a minimum length. */
export const passwordField = (minLength: number = 8) =>
  z
    .string()
    .min(1, { error: requiredMessage("password") })
    .min(minLength, { error: () => getConfig().messages.password.minLength(minLength) });

/** Signup, reset, and any write that hits `PasswordRules::required()`. */
export const strongPasswordField = () =>
  z
    .string()
    .min(1, { error: requiredMessage("password") })
    .regex(STRONG_PASSWORD, { error: () => getConfig().messages.password.strong });

export const confirmPasswordField = () =>
  z.string().min(1, { error: requiredMessage("confirmPassword") });

/** Adds the "passwords must match" check to a schema with both fields. */
export const withMatchingPasswords = <
  T extends z.ZodObject<{ password: z.ZodString; confirm_password: z.ZodString }>,
>(
  schema: T,
) =>
  schema.refine((values) => values.password === values.confirm_password, {
    error: () => getConfig().messages.confirmPassword.match,
    path: ["confirm_password"],
  });

export const otpCodeField = (length: number = 4) =>
  z
    .string()
    .min(1, { error: requiredMessage("code") })
    .length(length, { error: () => getConfig().messages.otp.length(length) });
