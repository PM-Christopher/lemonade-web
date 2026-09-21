"use client";

import { useEffect } from "react";
import { Button } from "@lemonade/ui";
import MainLayout from "@/components/layouts/MainLayout";
import { logger } from "@/lib/logger";

// Catches a render failure anywhere under (main) — the nav/sidebar (from
// MainLayout) stays usable, only the failed segment's content is replaced.
// docs/ARCHITECTURE.md's "Error boundaries per route segment": blast radius
// is one segment, not the app.
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
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          {error.digest ? `Reference: ${error.digest}` : "Please try again."}
        </p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </MainLayout>
  );
}
