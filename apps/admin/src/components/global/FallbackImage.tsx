"use client";
import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { getSafeImageSrc } from "@/lib/image-src";

type FallbackImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc: string;
};

// Shows fallbackSrc when src is missing, from an unknown host, or fails to load.
export function FallbackImage({ src, fallbackSrc, onError, alt, ...props }: FallbackImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const safeSrc = src?.startsWith("/") ? src : getSafeImageSrc(src, fallbackSrc);
  const showFallback = safeSrc === fallbackSrc || failedSrc === src;

  return (
    <Image
      {...props}
      alt={alt}
      src={showFallback ? fallbackSrc : safeSrc}
      onError={(event) => {
        setFailedSrc(src ?? null);
        onError?.(event);
      }}
    />
  );
}
