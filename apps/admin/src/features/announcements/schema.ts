import { z } from "zod";

// Mirrors App\Http\Requests\Admin\AnnouncementRequest.
export const announcementSchema = z.object({
  title: z.string().trim().min(1, { error: "Title is required" }).max(255),
  content: z.string().trim().min(1, { error: "Body is required" }),
});
export type AnnouncementInput = z.infer<typeof announcementSchema>;
