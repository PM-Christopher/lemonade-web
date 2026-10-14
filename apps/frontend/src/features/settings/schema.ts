import { z } from "zod";
import { getConfig, requiredTextField, strongPasswordField } from "@lemonade/validation";

// Mirrors the delete-account request: the current password, checked by the server.
export const deleteAccountSchema = z.object({
  password: z.string().min(1, { error: "Password is required" }),
});
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;

// Mirrors App\Http\Requests\Identity\ChangePasswordRequest.
export const changePasswordSchema = z
  .object({
    password: z.string().min(1, { error: "Password is required" }),
    new_password: strongPasswordField(),
    new_password_confirmation: z
      .string()
      .min(1, { error: () => getConfig().messages.confirmPassword.required }),
  })
  .refine((values) => values.new_password === values.new_password_confirmation, {
    error: () => getConfig().messages.confirmPassword.match,
    path: ["new_password_confirmation"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Mirrors App\Http\Requests\Billing\BankAccountRequest.
export const bankAccountSchema = z.object({
  bank_name: z.string().trim().min(1, { error: "Bank name is required" }),
  account_number: z.string().trim().min(1, { error: "Account number is required" }),
  account_name: z.string().trim().min(1, { error: "Account name is required" }),
});
export type BankAccountInput = z.infer<typeof bankAccountSchema>;

// Mirrors App\Http\Requests\Identity\UsernameRequest.
export const changeUsernameSchema = z.object({
  username: requiredTextField("username"),
});
export type ChangeUsernameInput = z.infer<typeof changeUsernameSchema>;

// Mirrors App\Http\Requests\Identity\BioRequest.
export const changeBioSchema = z.object({
  bio: requiredTextField("bio"),
});
export type ChangeBioInput = z.infer<typeof changeBioSchema>;

// Mirrors App\Http\Requests\Identity\ProfessionRequest.
export const changeProfessionSchema = z.object({
  industry: requiredTextField("industry"),
});
export type ChangeProfessionInput = z.infer<typeof changeProfessionSchema>;

// Mirrors App\Http\Requests\Identity\AddressRequest.
export const changeAddressSchema = z.object({
  address: requiredTextField("address"),
  city: requiredTextField("city"),
  country: requiredTextField("country"),
  state: requiredTextField("state"),
});
export type ChangeAddressInput = z.infer<typeof changeAddressSchema>;

// Mirrors App\Http\Requests\Identity\SkillsAndInterestsRequest.
export const changeSkillsSchema = z.object({
  skills: z.array(z.string()).min(3, { error: "At least three skills are required" }),
  interests: z.array(z.string()).min(3, { error: "At least three interests are required" }),
});
export type ChangeSkillsInput = z.infer<typeof changeSkillsSchema>;

// Mirrors App\Http\Requests\Identity\SocialsRequest (handles shaped for the form).
export const changeSocialsSchema = z.object({
  facebook: z.string().trim(),
  linkedin: z.string().trim(),
  twitter: z.string().trim(),
  instagram: z.string().trim(),
});
export type ChangeSocialsInput = z.infer<typeof changeSocialsSchema>;
