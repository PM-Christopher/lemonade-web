"use client";
import React from "react";
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

      <div className="mt-4 flex flex-col gap-3">
        {isLoading && (
          <p className="text-body-s text-text-grey py-10 text-center">Loading your feed...</p>
        )}

        {isError && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
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
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-body-s text-text-grey">No posts yet. Check back soon.</p>
          </div>
        )}

        {threads.map((thread) => (
          <FeedCard key={thread.id} thread={thread} />
        ))}

        {hasNextPage && (
          <button
            type="button"
            className="text-light-green text-body-s mt-2 rounded-lg bg-gray-100 p-3 font-semibold"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load more posts"}
          </button>
        )}
      </div>
    </div>
  );
}
