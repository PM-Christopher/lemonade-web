"use client";

import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";

// A page under (main) explicitly calling notFound() (e.g. "business not
// found") lands here rather than the root not-found.tsx.
export default function MainNotFound() {
  return (
    <MainLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-[8px] p-[24px] text-center">
        <p className="font-semiBold text-light-black text-[18px]">This page could not be found</p>
        <p className="text-text-grey text-[14px] font-normal">
          It may not exist, or you may not have access to it.
        </p>
        <Link
          href="/"
          className="border-step-color bg-gradient-green mt-[8px] rounded-[12px] border-[1px] px-[24px] py-[11px]"
        >
          <p className="text-[16px] font-medium text-white">Back to overview</p>
        </Link>
      </div>
    </MainLayout>
  );
}
