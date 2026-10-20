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
  media: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  polls: z.boolean().optional(),
  thread_polls: z
    .object({
      title: z.string().min(1, "Poll question is required").max(255),
      options: z.array(z.string().min(1).max(100)).min(2, "Add at least two options"),
      start_at: z.string().min(1),
      end_at: z.string().min(1),
    })
    .optional(),
});

export type AddTribeThreadInput = z.infer<typeof addTribeThreadSchema>;
