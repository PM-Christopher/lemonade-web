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
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-[8px] p-[24px] text-center">
        <p className="text-[18px] font-semiBold text-light-black">This page could not be found</p>
        <Link
          href="/"
          className="mt-[8px] rounded-[12px] border-[1px] border-step-color bg-gradient-green px-[24px] py-[11px]"
        >
          <p className="text-[16px] font-medium text-white">Go home</p>
        </Link>
      </div>
    </MainLayout>
  );
}
