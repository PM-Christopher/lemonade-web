import { z } from "zod";
import { emailField, strongPasswordField } from "@lemonade/validation";

// Mirrors lemonade-backend's App\Http\Requests\Admin\CreateAdminUserRequest. The
// form splits `name` into first and last name.
export const addTeamMemberSchema = z.object({
  first_name: z.string().trim().min(1, { error: "First name is required" }),
  last_name: z.string().trim().min(1, { error: "Last name is required" }),
  email: emailField,
  password: strongPasswordField(),
  role: z.string().trim().min(1, { error: "Role is required" }),
});
export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;

// Mirrors App\Http\Requests\Admin\ChangeAdminPasswordRequest (new_password is confirmed).
export const changePasswordSchema = z
  .object({
    password: z.string().min(1, { error: "Current password is required" }),
    new_password: strongPasswordField(),
    new_password_confirmation: z.string().min(1, { error: "Confirm the new password" }),
  })
  .refine((values) => values.new_password === values.new_password_confirmation, {
    path: ["new_password_confirmation"],
    error: "Passwords do not match",
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
