import * as yup from "yup";
import { getConfig } from "../config";
import type { FieldNames } from "../config";

/** Mirrors `App\Support\PasswordRules::strong()`. */
const STRONG_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~])(?=.{8,})/;

export const requiredTextField = (field: keyof FieldNames) =>
  yup
    .string()
    .trim()
    .required(() => `${getConfig().fieldNames[field]} is required`);

export const optionalTextField = () => yup.string().trim();

export const emailField = yup
  .string()
  .trim()
  .email(() => getConfig().messages.email.invalid)
  .required(() => `${getConfig().fieldNames.email} is required`);

/** Login and other screens that only ask for a minimum length. */
export const passwordField = (minLength: number = 8) =>
  yup
    .string()
    .min(minLength, () => getConfig().messages.password.minLength(minLength))
    .required(() => `${getConfig().fieldNames.password} is required`);

/** Signup, reset, and any write that hits `PasswordRules::required()`. */
export const strongPasswordField = () =>
  yup
    .string()
    .matches(STRONG_PASSWORD, () => getConfig().messages.password.strong)
    .required(() => `${getConfig().fieldNames.password} is required`);

export const confirmPasswordField = (refField: string) =>
  yup
    .string()
    .oneOf([yup.ref(refField)], () => getConfig().messages.confirmPassword.match)
    .required(() => `${getConfig().fieldNames.confirmPassword} is required`);

export const otpCodeField = (length: number = 4) =>
  yup
    .string()
    .length(length, () => getConfig().messages.otp.length(length))
    .required(() => `${getConfig().fieldNames.code} is required`);
