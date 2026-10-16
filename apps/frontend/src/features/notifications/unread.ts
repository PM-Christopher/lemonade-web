import type { AppNotification } from "./api";

// Notifications the user has not marked as read yet.
export function countUnread(notifications: AppNotification[] | undefined): number {
  return (notifications ?? []).filter((notification) => !notification.read_at).length;
}

// Caps the badge text so it never outgrows the bell.
export function formatBadgeCount(count: number): string {
  return count > 99 ? "99+" : String(count);
}
