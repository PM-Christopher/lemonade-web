"use client";

import { useEffect } from "react";
import Image from "next/image";
import { logger } from "@/lib/logger";
import { images } from "@/lib/images";

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
    <section className="bg-light_grey flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
      <Image src={images.LOGO} alt="logo" width={127} height={56} />
      <p className="font-semiBold text-light-black text-body-xl mt-4">Something went wrong</p>
      <p className="text-text-grey text-body-s font-normal">
        {error.digest ? `Reference: ${error.digest}` : "Please try again."}
      </p>
      <button
        onClick={() => reset()}
        className="border-step-color bg-gradient-green mt-2 rounded-xl border px-6 py-2.75"
      >
        <p className="text-body-l font-medium text-white">Try again</p>
      </button>
    </section>
  );
}
