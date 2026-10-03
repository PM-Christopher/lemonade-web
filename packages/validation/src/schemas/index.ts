import * as yup from "yup";
import {
  confirmPasswordField,
  emailField,
  otpCodeField,
  passwordField,
  requiredTextField,
  strongPasswordField,
  optionalTextField,
} from "../fields";

export const loginSchema = yup.object({
  email: emailField,
  password: passwordField(),
});

export const signupSchema = yup.object({
  fullname: requiredTextField("fullname"),
  email: emailField,
  password: strongPasswordField(),
  referral_code: optionalTextField(),
});

export const forgotPasswordSchema = yup.object({
  email: emailField,
});

export const resetPasswordSchema = yup.object({
  password: strongPasswordField(),
  confirm_password: confirmPasswordField("password"),
});

export const otpSchema = yup.object({
  code: otpCodeField(4),
});

export const contactAddressSchema = yup.object({
  address: requiredTextField("address"),
  city: requiredTextField("city"),
  country: requiredTextField("country"),
  state: requiredTextField("state"),
});

export const profileSetupSchema = yup.object({
  profile_image: optionalTextField(),
  bio: requiredTextField("bio"),
  username: requiredTextField("username"),
  industry: requiredTextField("industry"),
});

export const skillsInterestsSchema = yup.object({
  skills: yup.array().of(yup.string()).min(3, "At least three skills are required").required(),
  interests: yup
    .array()
    .of(yup.string())
    .min(3, "At least three interests are required")
    .required(),
});
