"use client";
import { FallbackImage } from "@/components/global/FallbackImage";
import { useBrandingQuery } from "@/features/settings/queries";
import { images } from "@/lib/images";

// The platform logo from settings, or the built-in one until a logo is set.
export function BrandLogo() {
  const { data } = useBrandingQuery();

  return (
    <FallbackImage
      src={data?.logo_url}
      fallbackSrc={images.LOGO}
      alt={data?.platform_name ?? "logo"}
      width={127}
      height={56}
      className="h-14 w-auto object-contain object-left"
      priority
    />
  );
}
