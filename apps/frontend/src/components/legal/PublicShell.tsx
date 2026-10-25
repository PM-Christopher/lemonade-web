import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/global/BrandLogo";
import { routes } from "@/lib/routes";

const FOOTER_LINKS = [
  { href: routes.HELP, label: "Help center" },
  { href: routes.TERMS, label: "Terms and conditions" },
  { href: routes.PRIVACY, label: "Privacy policy" },
  { href: routes.COOKIES, label: "Cookie policy" },
] as const;

// Frame for pages anyone can open without signing in.
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-light_grey flex min-h-screen flex-col">
      <header className="flex items-center justify-between bg-white p-2 px-6">
        <Link href={routes.HOME} aria-label="Home">
          <BrandLogo width={96} height={42} className="h-10 w-auto object-contain" />
        </Link>
        <Link href={routes.LOGIN} className="text-body-s text-light-green font-semibold">
          Log in
        </Link>
      </header>
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</div>
      <footer className="border-grey-20 border-t bg-white px-6 py-4">
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-text-grey text-body-s underline">
              {link.label}
            </Link>
          ))}
        </nav>
      </footer>
    </main>
  );
}
