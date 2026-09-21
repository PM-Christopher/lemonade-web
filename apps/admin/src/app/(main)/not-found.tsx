"use client";

import Link from "next/link";
import { Button } from "@lemonade/ui";
import MainLayout from "@/components/layouts/MainLayout";

// Fires for a genuinely unmatched (main) route AND for middleware.ts's
// permission-gate rewrite (an admin without a section's <section>.write
// permission gets routed here — see middleware.ts and
// docs/ARCHITECTURE.md §22 Conflict 2). Same content either way: this repo
// doesn't distinguish "doesn't exist" from "you can't see this" at the UI
// layer, on purpose.
export default function MainNotFound() {
  return (
    <MainLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-xl font-semibold">This page could not be found</h1>
        <p className="text-sm text-muted-foreground">
          It may not exist, or you may not have access to it.
        </p>
        <Button asChild>
          <Link href="/">Back to overview</Link>
        </Button>
      </div>
    </MainLayout>
  );
}
