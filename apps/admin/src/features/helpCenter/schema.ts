import { z } from "zod";

// Mirrors App\Http\Requests\Admin\FaqRequest.
export const faqSchema = z.object({
  category: z.string().min(1, "Choose a section"),
  question: z.string().trim().min(1, "Enter the question").max(255, "Keep it under 255 characters"),
  answer: z.string().trim().min(1, "Enter the answer").max(20000, "That answer is too long"),
  is_published: z.boolean(),
});

export type FaqInput = z.infer<typeof faqSchema>;
