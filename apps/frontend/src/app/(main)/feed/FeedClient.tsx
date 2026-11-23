"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import MainLayout from "@/components/layouts/MainLayout";
import { FeedCard } from "@/components/feed/FeedCard";
import { FeedTribeStrip } from "@/components/feed/FeedTribeStrip";
import { useFeedQuery } from "@/features/tribes/queries";
import type { RootState } from "@/redux/store";
import { routes } from "@/lib/routes";

function FeedClient() {
  const tribe = useSearchParams().get("tribe") ?? undefined;
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } =
    useFeedQuery(tribe, { enabled: isLoggedIn });

  const threads = data?.pages.flatMap((page) => page.threads) ?? [];
  const joinedTribes = data?.pages[0]?.joined_tribes ?? [];

  // Load the next page when the end of the list scrolls into view.
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = sentinel.current;
    if (!node || !hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !isFetchingNextPage) void fetchNextPage();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <MainLayout>
      <div className="phone:px-10 mx-auto w-full max-w-184 px-4 pt-4">
        <FeedTribeStrip tribes={joinedTribes} selected={tribe} />

        <div className="mt-4 flex flex-col gap-4">
          {isLoading && <p className="text-body-s text-text-grey py-10 text-center">Loading your feed...</p>}

          {isError && (
            <div className="rounded-lg bg-white p-6 text-center">
              <p className="text-body-s text-text-grey">We could not load the feed.</p>
              <button type="button" className="text-light-green text-body-s mt-2 font-semibold" onClick={() => refetch()}>
                Try again
              </button>
            </div>
          )}

          {!isLoading && !isError && threads.length === 0 && (
            <div className="rounded-lg bg-white p-6 text-center">
              <p className="text-body-s text-text-grey">
                {tribe ? "No posts in this tribe yet." : "Nothing to show yet. Join a tribe to fill your feed."}
              </p>
              <Link href={routes.TRIBE} className="text-light-green text-body-s mt-2 inline-block font-semibold">
                Find tribes
              </Link>
            </div>
          )}

          {threads.map((thread) => (
            <FeedCard key={thread.id} thread={thread} />
          ))}

          <div ref={sentinel} className="h-1" />
          {isFetchingNextPage && <p className="text-meta text-text-grey pb-4 text-center">Loading more...</p>}
        </div>
      </div>
    </MainLayout>
  );
}

export default FeedClient;
