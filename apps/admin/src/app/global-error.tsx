"use client";

import { useEffect } from "react";
import { Button } from "@lemonade/ui";
import { logger } from "@/lib/logger";
import "./globals.css";

// Only fires if the ROOT layout itself throws — everywhere else, the
// nearest segment's error.tsx catches it first (see (main)/error.tsx,
// (auth)/error.tsx). This replaces the whole document, so it has to render
// its own <html>/<body> and can't assume anything else in the tree
// (Providers, SideNav, auth state) is safe to use.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled root-level error", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            {error.digest ? `Reference: ${error.digest}` : "Please try reloading the page."}
          </p>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
