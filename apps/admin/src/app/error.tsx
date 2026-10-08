"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled root route error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
      <p className="mt-4 text-[18px] font-semibold">Something went wrong</p>
      <p className="text-[14px] font-normal text-gray-500">
        {error.digest ? `Reference: ${error.digest}` : "Please try again."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-2 rounded-xl border px-6 py-[11px]"
      >
        Try again
      </button>
    </section>
  );
}
