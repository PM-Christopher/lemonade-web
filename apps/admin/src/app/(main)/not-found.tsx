"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";

// A page under (main) explicitly calling notFound() (e.g. "business not
// found") lands here rather than the root not-found.tsx.
export default function MainNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 p-6 text-center">
      <p className="font-semiBold text-light-black text-body-xl">This page could not be found</p>
      <p className="text-text-grey text-body-s font-normal">
        It may not exist, or you may not have access to it.
      </p>
      <Link
        href={routes.HOME}
        className="border-step-color bg-gradient-green mt-2 rounded-xl border px-6 py-2.75"
      >
        <p className="text-body-l font-medium text-white">Back to overview</p>
      </Link>
    </div>
  );
}
