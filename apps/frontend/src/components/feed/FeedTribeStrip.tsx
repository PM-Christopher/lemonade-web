"use client";
import React from "react";
import Link from "next/link";
import { FallbackImage } from "@/components/global/FallbackImage";
import type { FeedTribe } from "@/features/tribes/api";
import { images } from "@/lib/images";
import { routes } from "@/lib/routes";
import { getInitials } from "@/lib/helper";

/** The tribes the user is in. Tapping one opens that tribe, where only its posts show. */
export function FeedTribeStrip({ tribes }: { tribes: FeedTribe[] }) {
  return (
    <nav aria-label="Your tribes" className="scrollbar-hide flex gap-3 overflow-x-auto py-1">
      {tribes.map((tribe) => (
        <Link
          key={tribe.id}
          href={routes.TRIBE_DETAIL(tribe.slug)}
          className="text-text-grey flex w-18 shrink-0 flex-col items-center gap-1.5"
        >
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-white">
            {tribe.image ? (
              <FallbackImage
                src={tribe.image}
                fallbackSrc={images.PLACEHOLDER}
                alt=""
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-body-s font-semibold">{getInitials(tribe.name)}</span>
            )}
          </span>
          <span className="text-meta w-full truncate text-center">{tribe.name}</span>
        </Link>
      ))}
    </nav>
  );
}
