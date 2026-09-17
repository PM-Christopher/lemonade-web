"use client";

import { useReportWebVitals } from "next/web-vitals";
import { usePathname } from "next/navigation";

// Mounted once in the root layout — see docs/ARCHITECTURE.md Phase 8.
// sendBeacon so a report in flight during navigation isn't dropped; falls
// back to fetch(keepalive) for browsers/test environments without it.
export function WebVitalsReporter() {
  const pathname = usePathname();

  useReportWebVitals((metric) => {
    const url = `/api/web-vitals?path=${encodeURIComponent(pathname)}`;
    const body = JSON.stringify(metric);

    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { method: "POST", body, keepalive: true }).catch(() => undefined);
    }
  });

  return null;
}
