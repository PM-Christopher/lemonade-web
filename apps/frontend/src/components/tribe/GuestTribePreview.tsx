import Link from "next/link";
import { BrandLogo } from "@/components/global/BrandLogo";
import { FallbackImage } from "@/components/global/FallbackImage";
import type { PublicTribeResponse } from "@/features/tribes/api";
import { formatNairaWhole } from "@/lib/formatNumber";
import { images } from "@/lib/images";
import { routes } from "@/lib/routes";

interface GuestTribePreviewProps {
  tribe: PublicTribeResponse["tribe"];
}

// Read-only tribe summary for signed-out visitors, with a way to sign up or log in.
export function GuestTribePreview({ tribe }: GuestTribePreviewProps) {
  const returnPath = routes.TRIBE_DETAIL(tribe.slug);
  const loginHref = `${routes.LOGIN}?next=${encodeURIComponent(returnPath)}`;

  return (
    <main className="bg-light_grey min-h-screen">
      <header className="flex items-center justify-between bg-white p-2 px-6">
        <BrandLogo width={96} height={42} className="h-10 w-auto object-contain" />
        <Link href={loginHref} className="text-body-s text-light-green font-semibold">
          Log in
        </Link>
      </header>

      <section className="mx-auto mt-6 w-full max-w-xl overflow-hidden rounded-2xl bg-white pb-6">
        <FallbackImage
          src={tribe.image}
          fallbackSrc={images.DEFAULT_TRIBE}
          alt={tribe.tribe_name}
          width={576}
          height={288}
          priority
          className="h-48 w-full object-cover"
        />
        <div className="flex flex-col gap-4 px-6 pt-5">
          <div>
            <p className="text-meta text-light-green font-semibold uppercase">{tribe.category}</p>
            <h1 className="font-ruso text-title-xl text-primary-black font-bold">
              {tribe.tribe_name}
            </h1>
            <p className="text-meta text-text-grey">Created by {tribe.created_by}</p>
          </div>

          <p className="text-body-l text-text-grey whitespace-pre-line">{tribe.description}</p>

          <div className="text-body-s flex gap-6 font-semibold">
            <span>{tribe.members.toLocaleString()} members</span>
            <span>{tribe.threads.toLocaleString()} threads</span>
            <span>{tribe.monetized ? formatNairaWhole(tribe.membership_fee) : "Free"}</span>
          </div>

          <div className="mt-2 flex flex-col gap-3">
            <Link
              href={routes.SIGNUP}
              className="bg-gradient-green flex h-12 w-full items-center justify-center rounded-xl font-sans font-semibold text-white"
            >
              Sign up to join this tribe
            </Link>
            <p className="text-body-s text-text-grey text-center">
              Already have an account?{" "}
              <Link href={loginHref} className="text-light-green font-semibold underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
