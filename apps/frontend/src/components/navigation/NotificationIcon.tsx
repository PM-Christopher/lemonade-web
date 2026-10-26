import { FiBell, FiBriefcase, FiCalendar, FiFlag, FiGlobe, FiMessageSquare } from "react-icons/fi";

export type NotificationIconKind = "globe" | "chat" | "calendar" | "briefcase" | "flag" | "bell";

const KINDS: Record<string, NotificationIconKind> = {
  connect: "globe",
  connect_response: "globe",
  thread: "chat",
  tribe: "chat",
  event: "calendar",
  business: "briefcase",
  service: "briefcase",
  job: "briefcase",
  report: "flag",
};

// Maps a notification type to its icon; unknown types get the bell.
export function notificationIconKind(type: string | undefined): NotificationIconKind {
  return (type && KINDS[type]) || "bell";
}

export const NotificationIcon = ({ type, size = 18 }: { type?: string; size?: number }) => {
  switch (notificationIconKind(type)) {
    case "globe":
      return <FiGlobe size={size} aria-hidden="true" />;
    case "chat":
      return <FiMessageSquare size={size} aria-hidden="true" />;
    case "calendar":
      return <FiCalendar size={size} aria-hidden="true" />;
    case "briefcase":
      return <FiBriefcase size={size} aria-hidden="true" />;
    case "flag":
      return <FiFlag size={size} aria-hidden="true" />;
    default:
      return <FiBell size={size} aria-hidden="true" />;
  }
};
