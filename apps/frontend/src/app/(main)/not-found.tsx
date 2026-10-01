"use client";

import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";

// A page under (main) explicitly calling notFound() lands here rather than
// the root not-found.tsx. Safe to wrap in MainLayout: every (main) route
// (event/tribe/business/settings, plus "/") is in middleware.ts's
// PROTECTED_PREFIXES, so reaching a real page here at all means the
// visitor is authenticated.
export default function MainNotFound() {
  return (
    <MainLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="font-semiBold text-light-black text-[18px]">This page could not be found</p>
        <Link
          href="/"
          className="border-step-color bg-gradient-green mt-2 rounded-xl border px-6 py-[11px]"
        >
          <p className="text-[16px] font-medium text-white">Go home</p>
        </Link>
      </div>
    </MainLayout>
  );
}
