import React from "react";

/** "9+" for anything over nine. */
export const formatBadgeCount = (count: number) => (count > 9 ? "9+" : String(count));

// Small red counter that sits on the corner of an icon button. Hidden at zero.
export function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span
      aria-hidden="true"
      className="text-meta absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 leading-none font-semibold text-white"
    >
      {formatBadgeCount(count)}
    </span>
  );
}
