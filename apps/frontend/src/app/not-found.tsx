import Link from "next/link";
import { Button } from "@lemonade/ui";

// Next resolves not-found by closest matching layout tree — a genuinely
// unmatched path (one that doesn't match any real route under (main) or
// (auth) at all) falls all the way back to this root file, not a
// route-group one. Confirmed live in the admin app's equivalent case.
// Kept neutral (no MainLayout/AuthLayout) since this can trigger before
// there's any way to know which shell, if either, applies.
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">This page could not be found</h1>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
