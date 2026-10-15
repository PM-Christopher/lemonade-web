"use client";
import { useState } from "react";
import Image, { type ImageProps } from "next/image";

type FallbackImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc: string;
};

// Shows fallbackSrc when src is missing or fails to load (broken or deleted URL).
export function FallbackImage({ src, fallbackSrc, onError, alt, ...props }: FallbackImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showFallback = !src || failedSrc === src;

  return (
    <Image
      {...props}
      alt={alt}
      src={showFallback ? fallbackSrc : src}
      onError={(event) => {
        setFailedSrc(src ?? null);
        onError?.(event);
      }}
    />
  );
}
