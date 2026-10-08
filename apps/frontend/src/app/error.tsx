"use client";

import { useEffect } from "react";
import Image from "next/image";
import { logger } from "@/lib/logger";
import { images } from "@/lib/images";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled root route error", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <section className="bg-light_grey flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
      <Image src={images.LOGO} alt="logo" width={127} height={56} />
      <p className="font-semiBold text-light-black mt-4 text-[18px]">Something went wrong</p>
      <p className="text-text-grey text-[14px] font-normal">
        {error.digest ? `Reference: ${error.digest}` : "Please try again."}
      </p>
      <button
        onClick={() => reset()}
        className="border-step-color bg-gradient-green mt-2 rounded-xl border px-6 py-[11px]"
      >
        <p className="text-[16px] font-medium text-white">Try again</p>
      </button>
    </section>
  );
}
