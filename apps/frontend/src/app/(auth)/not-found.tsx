"use client";

import Link from "next/link";
import Image from "next/image";

export default function AuthNotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-[8px] bg-light_grey p-[24px] text-center">
      <Image src={"/images/logo.png"} alt="logo" width={127} height={56} />
      <p className="mt-[16px] text-[18px] font-semiBold text-light-black">
        This page could not be found
      </p>
      <Link
        href="/login"
        className="mt-[8px] rounded-[12px] border-[1px] border-step-color bg-gradient-green px-[24px] py-[11px]"
      >
        <p className="text-[16px] font-medium text-white">Back to login</p>
      </Link>
    </section>
  );
}
