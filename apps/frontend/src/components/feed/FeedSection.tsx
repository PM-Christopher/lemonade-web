"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FeedCard } from "@/components/feed/FeedCard";
import { FeedTribeStrip } from "@/components/feed/FeedTribeStrip";
import { useFeedQuery } from "@/features/tribes/queries";
import type { RootState } from "@/redux/store";
import { routes } from "@/lib/routes";

/** The tribe strip and the timeline under it. Shows posts even when the user has joined no tribe. */
export function FeedSection() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } =
    useFeedQuery(undefined, { enabled: isLoggedIn });

  const threads = data?.pages.flatMap((page) => page.threads) ?? [];
  const joinedTribes = data?.pages[0]?.joined_tribes ?? [];

  // The next page loads when the end of the row scrolls into view.
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = end.current;
    if (!node || !hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !isFetchingNextPage) void fetchNextPage();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="w-full">
      <p className="text-title-r font-sans font-semibold">Tribe feed</p>
      {joinedTribes.length > 0 ? (
        <div className="mt-3">
          <FeedTribeStrip tribes={joinedTribes} />
        </div>
      ) : (
        !isLoading && (
          <p className="text-body-s text-text-grey mt-1">
            Join a tribe to see its posts first.{" "}
            <Link href={routes.TRIBE} className="text-light-green font-semibold">
              Find tribes
            </Link>
          </p>
        )
      )}

      {isLoading && (
        <p className="text-body-s text-text-grey py-10 text-center">Loading your feed...</p>
      )}

      {isError && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-body-s text-text-grey">We could not load the feed.</p>
          <button
            type="button"
            className="text-light-green text-body-s mt-2 font-semibold"
            onClick={() => refetch()}
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && threads.length === 0 && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-body-s text-text-grey">No posts yet. Check back soon.</p>
        </div>
      )}

      {threads.length > 0 && (
        <div className="scrollbar-hide mt-3 flex items-start gap-3 overflow-x-auto py-4 shadow-none">
          {threads.map((thread) => (
            <div key={thread.id} className="phone:w-105.5 w-[80vw] max-w-105.5 shrink-0">
              <FeedCard thread={thread} />
            </div>
          ))}
          {hasNextPage && (
            <div ref={end} className="text-meta text-text-grey flex w-24 shrink-0 self-center">
              {isFetchingNextPage ? "Loading..." : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
