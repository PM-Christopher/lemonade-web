import { z } from "zod";

// Mirrors lemonade-backend's App\Http\Requests\Admin\CreateAdminTribeRequest.
export const createTribeSchema = z.object({
  tribe_name: z.string().min(1, "Tribe name is required").max(255),
  image: z.string().min(1, "An image is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
});

export type CreateTribeInput = z.infer<typeof createTribeSchema>;

// Mirrors lemonade-backend's App\Http\Requests\Admin\AddAdminTribeThreadRequest.
export const addTribeThreadSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  thoughts: z.string().min(1, "Thoughts are required"),
});

export type AddTribeThreadInput = z.infer<typeof addTribeThreadSchema>;
