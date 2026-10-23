import { z } from "zod";

// Mirrors App\Http\Requests\Admin\PlatformSettingsRequest.
export const platformSettingsSchema = z.object({
  platform_name: z
    .string()
    .trim()
    .min(1, "Enter a platform name")
    .max(80, "Keep it under 80 characters"),
  inactivity_timeout_minutes: z
    .number({ message: "Enter a number of minutes" })
    .int("Use whole minutes")
    .min(1, "At least 1 minute")
    .max(120, "At most 120 minutes"),
});

export type PlatformSettingsInput = z.infer<typeof platformSettingsSchema>;
