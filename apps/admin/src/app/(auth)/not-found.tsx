"use client";

import Link from "next/link";
import Image from "next/image";
import { routes } from "@/lib/routes";
import { images } from "@/lib/images";

export default function AuthNotFound() {
  return (
    <section className="bg-light-grey h-full min-h-screen overflow-hidden">
      <div className="flex flex-wrap items-center justify-between p-2 px-10">
        <Image src={images.LOGO} alt="logo" width={127} height={56} />
      </div>
      <div className="mt-24 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="font-semiBold text-light-black text-body-xl">This page could not be found</p>
        <Link
          href={routes.LOGIN}
          className="border-step-color bg-gradient-green mt-2 rounded-xl border px-6 py-2.75"
        >
          <p className="text-body-l font-medium text-white">Back to login</p>
        </Link>
      </div>
    </section>
  );
}
