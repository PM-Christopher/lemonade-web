"use client";

import Link from "next/link";
import Image from "next/image";

// Next resolves not-found by closest matching layout tree — a genuinely
// unmatched path (one that doesn't match any real route under (main) or
// (auth) at all) falls all the way back to this root file, not a
// route-group one. Confirmed live in the admin app's equivalent case.
//
// Deliberately NOT wrapped in MainLayout, unlike admin's equivalent file:
// this app's middleware.ts only protects an allowlist of prefixes
// (PROTECTED_PREFIXES) — a random unmatched path isn't one of them, so an
// unauthenticated visitor can genuinely land here. MainLayout assumes an
// app shell/session context this route can't guarantee.
export default function RootNotFound() {
  return (
    <section className="bg-light_grey flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
      <Image src={"/images/logo.png"} alt="logo" width={127} height={56} />
      <p className="font-semiBold text-light-black mt-4 text-[18px]">
        This page could not be found
      </p>
      <Link
        href="/"
        className="border-step-color bg-gradient-green mt-2 rounded-xl border px-6 py-[11px]"
      >
        <p className="text-[16px] font-medium text-white">Go home</p>
      </Link>
    </section>
  );
}
