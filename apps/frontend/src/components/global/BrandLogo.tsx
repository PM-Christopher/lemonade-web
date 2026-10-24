"use client";
import { FallbackImage } from "@/components/global/FallbackImage";
import { useBrandingQuery } from "@/features/branding/queries";
import { images } from "@/lib/images";

interface BrandLogoProps {
  width: number;
  height: number;
  className?: string;
}

// The logo set in the admin console, or the built-in one if none is set or it fails to load.
export function BrandLogo({ width, height, className }: BrandLogoProps) {
  const { data } = useBrandingQuery();

  return (
    <FallbackImage
      src={data?.logo_url}
      fallbackSrc={images.LOGO}
      alt={data?.platform_name ?? "The Lemonade Network"}
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
