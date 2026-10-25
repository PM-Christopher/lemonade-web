import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { BackHeader } from "@/components/global/BackHeader";
import { BrandLogo } from "@/components/global/BrandLogo";
import MainLayout from "@/components/layouts/MainLayout";
import { SIGNED_IN_COOKIE, USER_TOKEN_COOKIE } from "@/lib/cookie-names";
import { routes } from "@/lib/routes";

const FOOTER_LINKS = [
  { href: routes.HELP, label: "Help center" },
  { href: routes.TERMS, label: "Terms and conditions" },
  { href: routes.PRIVACY, label: "Privacy policy" },
  { href: routes.COOKIES, label: "Cookie policy" },
] as const;

// Frame for pages anyone can open. Signed-in people get the same top bar as the rest of the app.
export async function PublicShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const store = await cookies();
  // A hint only, for choosing the frame; the pages themselves are public.
  const hasSession = Boolean(store.get(USER_TOKEN_COOKIE) || store.get(SIGNED_IN_COOKIE));

  if (hasSession) {
    return (
      <MainLayout>
        <section className="bg-light_grey pb-10">
          <BackHeader title={title} />
          <div className="mx-auto w-full max-w-3xl px-4 py-8">{children}</div>
        </section>
      </MainLayout>
    );
  }

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
