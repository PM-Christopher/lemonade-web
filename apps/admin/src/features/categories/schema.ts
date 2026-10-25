import { z } from "zod";

// Mirrors App\Http\Requests\Admin\CategoryRequest (the type is set by the page).
export const categorySchema = z.object({
  name: z.string().trim().min(1, "Enter a name").max(60, "Keep it under 60 characters"),
  description: z.string().trim().max(255, "Keep it under 255 characters"),
});

export type CategoryInput = z.infer<typeof categorySchema>;
