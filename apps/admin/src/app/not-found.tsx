"use client";

import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";

// Next resolves not-found by closest matching layout tree — a path that
// doesn't match any real route under (main) or (auth) at all (genuinely
// unmatched, or middleware.ts's permission-gate rewrite target — see
// middleware.ts and docs/ARCHITECTURE.md §22 Conflict 2) falls all the way
// back to this root file, not a route-group one. Confirmed live: neither
// (main)/not-found.tsx nor (auth)/not-found.tsx fires for either case.
//
// Safe to wrap in MainLayout despite being root-level: middleware.ts
// redirects any unauthenticated request to /login before Next's routing
// even resolves to a not-found render, for every non-public path — so by
// the time this ever renders, the visitor is guaranteed to have a session.
export default function RootNotFound() {
  return (
    <MainLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-[8px] p-[24px] text-center">
        <p className="text-[18px] font-semiBold text-light-black">This page could not be found</p>
        <p className="text-[14px] font-normal text-text-grey">
          It may not exist, or you may not have access to it.
        </p>
        <Link
          href="/"
          className="mt-[8px] rounded-[12px] border-[1px] border-step-color bg-gradient-green px-[24px] py-[11px]"
        >
          <p className="text-[16px] font-medium text-white">Back to overview</p>
        </Link>
      </div>
    </MainLayout>
  );
}
