"use client";

import Link from "next/link";
import Image from "next/image";

export default function AuthNotFound() {
  return (
    <section className="bg-light-grey h-full min-h-screen overflow-hidden">
      <div className="flex flex-wrap items-center justify-between p-2 px-10">
        <Image src={"/images/logo.png"} alt="logo" width={127} height={56} />
      </div>
      <div className="mt-24 flex flex-col items-center justify-center gap-[8px] p-[24px] text-center">
        <p className="font-semiBold text-light-black text-[18px]">This page could not be found</p>
        <Link
          href="/login"
          className="border-step-color bg-gradient-green mt-[8px] rounded-[12px] border-[1px] px-[24px] py-[11px]"
        >
          <p className="text-[16px] font-medium text-white">Back to login</p>
        </Link>
      </div>
    </section>
  );
}
