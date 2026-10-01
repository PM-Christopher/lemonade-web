"use client";

import { useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { logger } from "@/lib/logger";

// Catches a render failure anywhere under (main) — the top/bottom nav
// (from MainLayout) stays usable, only the failed segment's content is
// replaced. docs/ARCHITECTURE.md's "Error boundaries per route segment":
// blast radius is one segment, not the app. Safe to wrap in MainLayout:
// every (main) route is in middleware.ts's PROTECTED_PREFIXES, so
// reaching a real page here at all means the visitor is authenticated.
export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled (main) route error", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <MainLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="font-semiBold text-light-black text-[18px]">Something went wrong</p>
        <p className="text-text-grey text-[14px] font-normal">
          {error.digest ? `Reference: ${error.digest}` : "Please try again."}
        </p>
        <button
          onClick={() => reset()}
          className="border-step-color bg-gradient-green mt-2 rounded-xl border px-6 py-[11px]"
        >
          <p className="text-[16px] font-medium text-white">Try again</p>
        </button>
      </div>
    </MainLayout>
  );
}
