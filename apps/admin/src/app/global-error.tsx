"use client";

import { useEffect } from "react";
import Image from "next/image";
import { logger } from "@/lib/logger";
import "./globals.css";

// Only fires if the ROOT layout itself throws — everywhere else, the
// nearest segment's error.tsx catches it first (see (main)/error.tsx,
// (auth)/error.tsx). This replaces the whole document, so it has to render
// its own <html>/<body> and deliberately avoids MainLayout/AuthLayout —
// both have their own data-fetching/hooks that could compound whatever
// broke the root layout. Still imports globals.css directly, so the real
// brand styling (confirmed live) renders correctly even here.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled root-level error", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <section className="flex min-h-screen flex-col items-center justify-center gap-[8px] bg-light-grey p-[24px] text-center">
          <Image src={"/images/logo.png"} alt="logo" width={127} height={56} />
          <p className="mt-[16px] text-[18px] font-semiBold text-light-black">
            Something went wrong
          </p>
          <p className="text-[14px] font-normal text-text-grey">
            {error.digest ? `Reference: ${error.digest}` : "Please try reloading the page."}
          </p>
          <button
            onClick={() => reset()}
            className="mt-[8px] rounded-[12px] border-[1px] border-step-color bg-gradient-green px-[24px] py-[11px]"
          >
            <p className="text-[16px] font-medium text-white">Try again</p>
          </button>
        </section>
      </body>
    </html>
  );
}
