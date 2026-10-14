import { z } from "zod";

// Mirrors lemonade-backend's SocialsRequest. Every handle is optional; empty ones aren't sent.
export const socialHandlesSchema = z.object({
  facebook: z.string().trim(),
  linkedin: z.string().trim(),
  twitter: z.string().trim(),
  instagram: z.string().trim(),
});
export type SocialHandlesInput = z.infer<typeof socialHandlesSchema>;
