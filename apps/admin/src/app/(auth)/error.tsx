"use client";

import { useEffect } from "react";
import { Button } from "@lemonade/ui";
import { logger } from "@/lib/logger";

// Deliberately not wrapped in AuthLayout — that component redirects based
// on pathname/cookie checks (see components/layouts/AuthLayout.tsx), which
// isn't something an error boundary should depend on while recovering from
// a failure.
export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled (auth) route error", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        {error.digest ? `Reference: ${error.digest}` : "Please try again."}
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
