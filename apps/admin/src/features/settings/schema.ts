import { z } from "zod";

// Zero keeps the log forever.
const retentionDays = (message: string) =>
  z
    .number({ message })
    .int("Use whole days")
    .min(0, "Use 0 to keep it forever")
    .max(3650, "At most 3650 days");

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
  audit_retention_days: retentionDays("Enter a number of days"),
  user_activity_retention_days: retentionDays("Enter a number of days"),
  account_deletion_grace_days: z
    .number({ message: "Enter a number of days" })
    .int("Use whole days")
    .min(1, "At least 1 day")
    .max(365, "At most 365 days"),
});

export type PlatformSettingsInput = z.infer<typeof platformSettingsSchema>;
