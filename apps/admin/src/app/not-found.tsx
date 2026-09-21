import Link from "next/link";
import { Button } from "@lemonade/ui";

// Next resolves not-found by closest matching layout tree — a path that
// doesn't match any real route under (main) or (auth) at all (genuinely
// unmatched, or middleware.ts's permission-gate rewrite target — see
// middleware.ts and docs/ARCHITECTURE.md §22 Conflict 2) falls all the way
// back to this root file, not a route-group one. Confirmed live: neither
// (main)/not-found.tsx nor (auth)/not-found.tsx fires for either case.
// Kept neutral (no MainLayout/AuthLayout) since this can trigger before
// there's any way to know which shell, if either, applies.
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">This page could not be found</h1>
      <p className="text-sm text-muted-foreground">
        It may not exist, or you may not have access to it.
      </p>
      <Button asChild>
        <Link href="/">Go to Lemonade Admin</Link>
      </Button>
    </div>
  );
}
