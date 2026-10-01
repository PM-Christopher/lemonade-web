"use client";

import { useEffect } from "react";
import Image from "next/image";
import { logger } from "@/lib/logger";

// Deliberately not wrapped in AuthLayout — that component redirects based
// on pathname/cookie checks (see components/layouts/AuthLayout.tsx), which
// isn't something an error boundary should depend on while recovering from
// a failure. Reuses AuthLayout's visual shell (logo, light-grey page
// background) by hand instead, to still look like this app rather than a
// generic error page.
export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled (auth) route error", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <section className="bg-light-grey h-full min-h-screen overflow-hidden">
      <div className="flex flex-wrap items-center justify-between p-2 px-10">
        <Image src={"/images/logo.png"} alt="logo" width={127} height={56} />
      </div>
      <div className="mt-24 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="font-semiBold text-light-black text-[18px]">Something went wrong</p>
        <p className="text-text-grey text-[14px] font-normal">
          {error.digest ? `Reference: ${error.digest}` : "Please try again."}
        </p>
        <button
          onClick={() => reset()}
          className="border-step-color bg-gradient-green mt-2 rounded-xl border px-6 py-[11px]"
        >
          <p className="text-[16px] font-medium text-white">Try again</p>
        </button>
      </div>
    </section>
  );
}
