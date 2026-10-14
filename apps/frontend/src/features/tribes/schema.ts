import { z } from "zod";
import { amountField } from "@lemonade/validation";

// Mirrors CreateTribe action inputs (user create-tribe has no FormRequest yet).
export const createTribeSchema = z
  .object({
    tribe_name: z.string().trim().min(1, { error: "Tribe name is required" }),
    category: z.string().trim().min(1, { error: "Category is required" }),
    description: z.string().trim().min(1, { error: "Description is required" }),
    image: z.string().min(1, { error: "Image is required" }),
    private: z.boolean(),
    monetized: z.boolean(),
    membership_fee: z.string().trim(),
    members: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    if (!data.monetized) return;
    const parsed = amountField({ label: "Membership fee" }).safeParse(data.membership_fee);
    if (!parsed.success) {
      ctx.addIssue({
        code: "custom",
        message: parsed.error.issues[0]?.message ?? "Membership fee is required",
        path: ["membership_fee"],
      });
    }
  });

export type CreateTribeInput = z.infer<typeof createTribeSchema>;

// Mirrors App\Http\Requests\Tribe\CreateTribeThreadRequest (topic/thoughts required).
export const createThreadSchema = z.object({
  topic: z.string().trim().min(1, { error: "Topic is required" }),
  thoughts: z.string().trim().min(1, { error: "Thoughts is required" }),
  media: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  polls: z.boolean(),
});
export type CreateThreadInput = z.infer<typeof createThreadSchema>;
