"use client";
import React from "react";
import Link from "next/link";
import { FallbackImage } from "@/components/global/FallbackImage";
import type { FeedTribe } from "@/features/tribes/api";
import { images } from "@/lib/images";
import { routes } from "@/lib/routes";
import { getInitials } from "@/lib/helper";

/** The tribes the user is in. Picking one narrows the feed to it, and "All" brings the mix back. */
export function FeedTribeStrip({
  tribes,
  selected,
}: {
  tribes: FeedTribe[];
  selected: string | undefined;
}) {
  const item = (active: boolean) =>
    `flex w-18 shrink-0 flex-col items-center gap-1.5 ${active ? "text-light-green" : "text-text-grey"}`;
  const ring = (active: boolean) =>
    `flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 bg-white ${active ? "border-light-green" : "border-gray-200"}`;

  return (
    <nav aria-label="Your tribes" className="scrollbar-hide flex gap-3 overflow-x-auto py-1">
      <Link href={routes.FEED} className={item(!selected)} aria-current={!selected ? "page" : undefined}>
        <span className={ring(!selected)}>
          <span className="text-body-s font-semibold">All</span>
        </span>
        <span className="text-meta w-full truncate text-center">Feed</span>
      </Link>
      {tribes.map((tribe) => {
        const active = selected === tribe.slug;
        return (
          <Link
            key={tribe.id}
            href={`${routes.FEED}?tribe=${encodeURIComponent(tribe.slug)}`}
            className={item(active)}
            aria-current={active ? "page" : undefined}
          >
            <span className={ring(active)}>
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
        );
      })}
    </nav>
  );
}
