import { z } from "zod";
import {
  confirmPasswordField,
  emailField,
  otpCodeField,
  optionalTextField,
  passwordField,
  requiredTextField,
  strongPasswordField,
  withMatchingPasswords,
} from "../fields";

// Mirrors App\Http\Requests\User\LoginRequest (and the admin one).
export const loginSchema = z.object({
  email: emailField,
  password: passwordField(),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Mirrors App\Http\Requests\User\SignUpRequest.
export const signupSchema = z.object({
  fullname: requiredTextField("fullname"),
  email: emailField,
  password: strongPasswordField(),
  referral_code: optionalTextField(),
});
export type SignupInput = z.infer<typeof signupSchema>;

// Mirrors the forgot-password FormRequest (email only).
export const forgotPasswordSchema = z.object({
  email: emailField,
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Mirrors the reset-password FormRequest (PasswordRules::required() + confirmed).
export const resetPasswordSchema = withMatchingPasswords(
  z.object({
    password: strongPasswordField(),
    confirm_password: confirmPasswordField(),
  }),
);
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Mirrors the OTP verify FormRequest (4-digit code).
export const otpSchema = z.object({
  code: otpCodeField(4),
});
export type OtpCodeInput = z.infer<typeof otpSchema>;

// Mirrors App\Http\Requests\User\AddressRequest.
export const contactAddressSchema = z.object({
  address: requiredTextField("address"),
  city: requiredTextField("city"),
  country: requiredTextField("country"),
  state: requiredTextField("state"),
});
export type ContactAddressInput = z.infer<typeof contactAddressSchema>;

// Mirrors App\Http\Requests\User\ProfileSetupRequest.
export const profileSetupSchema = z.object({
  profile_image: optionalTextField(),
  bio: requiredTextField("bio"),
  username: requiredTextField("username"),
  industry: requiredTextField("industry"),
});
export type ProfileSetupInput = z.infer<typeof profileSetupSchema>;

// Mirrors the skills/interests setup FormRequest (at least three of each).
export const skillsInterestsSchema = z.object({
  skills: z.array(z.string()).min(3, { error: "At least three skills are required" }),
  interests: z.array(z.string()).min(3, { error: "At least three interests are required" }),
});
export type SkillsInterestsInput = z.infer<typeof skillsInterestsSchema>;
