"use client";

import Link from "next/link";
import Image from "next/image";

export default function AuthNotFound() {
  return (
    <section className="bg-light_grey flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
      <Image src={"/images/logo.png"} alt="logo" width={127} height={56} />
      <p className="font-semiBold text-light-black mt-4 text-[18px]">
        This page could not be found
      </p>
      <Link
        href="/login"
        className="border-step-color bg-gradient-green mt-2 rounded-xl border px-6 py-[11px]"
      >
        <p className="text-[16px] font-medium text-white">Back to login</p>
      </Link>
    </section>
  );
}
