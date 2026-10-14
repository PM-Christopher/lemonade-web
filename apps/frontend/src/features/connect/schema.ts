import { z } from "zod";

// Mirrors App\Http\Requests\Connect\SendConnectInviteRequest (message required).
export const sendConnectInviteSchema = z.object({
  message: z.string().trim().min(1, { error: "Message is required" }),
});
export type SendConnectInviteInput = z.infer<typeof sendConnectInviteSchema>;
