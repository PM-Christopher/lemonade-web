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
