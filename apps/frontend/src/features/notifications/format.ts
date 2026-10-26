import dayjs from "dayjs";

// "26 Oct, 4:05 PM", or nothing when the value is missing or not a date.
export function formatNotificationTime(value?: string | null): string {
  const date = value ? dayjs(value) : null;
  return date?.isValid() ? date.format("D MMM, h:mm A") : "";
}
