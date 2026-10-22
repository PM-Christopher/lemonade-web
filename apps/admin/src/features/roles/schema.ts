import { z } from "zod";

// Mirrors lemonade-backend's App\Http\Requests\Admin\AdminRoleRequest. The name becomes a slug there.
export const roleSchema = z.object({
  name: z.string().trim().min(1, { error: "Name is required" }).max(60),
  permissions: z.array(z.string()).min(1, { error: "Choose at least one permission" }),
});
export type RoleInput = z.infer<typeof roleSchema>;
