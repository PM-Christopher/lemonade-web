"use client";

import { images } from "@/lib/images";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/lib/routes";

export default function AuthNotFound() {
  return (
    <section className="bg-light_grey flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
      <Image src={images.LOGO} alt="logo" width={127} height={56} />
      <p className="font-semiBold text-light-black text-body-xl mt-4">
        This page could not be found
      </p>
      <Link
        href={routes.LOGIN}
        className="border-step-color bg-gradient-green mt-2 rounded-xl border px-6 py-2.75"
      >
        <p className="text-body-l font-medium text-white">Back to login</p>
      </Link>
    </section>
  );
}
