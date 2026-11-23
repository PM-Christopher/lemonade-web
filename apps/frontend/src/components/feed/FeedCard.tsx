"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Heart as HeartIcon, MessageCircle as CommentIcon } from "lucide-react";
import { FallbackImage } from "@/components/global/FallbackImage";
import ImageCarousel from "@/components/global/ImageCarousel";
import { useLikeThreadMutation } from "@/features/tribes/mutations";
import type { FeedThread } from "@/features/tribes/api";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { images } from "@/lib/images";
import { routes } from "@/lib/routes";
import { getInitials } from "@/lib/helper";

const PREVIEW_CHARS = 280;

/** One thread in the feed, with the tribe it came from and a way into that tribe. */
export function FeedCard({ thread }: { thread: FeedThread }) {
  const dispatch = useAppDispatch();
  const likeMutation = useLikeThreadMutation();
  const [hasLiked, setHasLiked] = useState(thread.hasLiked);
  const [likes, setLikes] = useState(thread.likes);
  const [expanded, setExpanded] = useState(false);

  const author = thread.created_by?.user;
  const tribeHref = routes.TRIBE_DETAIL(thread.tribe.slug);
  const text = thread.thoughts ?? "";
  const isLong = text.length > PREVIEW_CHARS;

  const toggleLike = () => {
    const wasLiked = hasLiked;
    setHasLiked(!wasLiked);
    setLikes((count) => count + (wasLiked ? -1 : 1));
    likeMutation.mutate(
      { tribeId: thread.tribe.id, threadId: thread.id },
      {
        onError: () => {
          setHasLiked(wasLiked);
          setLikes((count) => count + (wasLiked ? 1 : -1));
          dispatch(updateToastifyReducer({ show: true, message: "Failed to like post", type: "error" }));
        },
      },
    );
  };

  return (
    <article className="rounded-lg bg-white p-4">
      <header className="flex items-center gap-3">
        {author?.avatar ? (
          <FallbackImage
            src={author.avatar}
            fallbackSrc={images.AVATAR_4}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover"
          />
        ) : (
          <div className="bg-gradient-green flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white">
            {getInitials(author?.fullname)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-body-s truncate font-semibold">{author?.username ?? author?.fullname}</p>
          <p className="text-meta text-text-grey">{thread.created_at}</p>
        </div>
        <Link
          href={tribeHref}
          className="bg-light-tint text-light-green text-meta max-w-[40%] truncate rounded-full px-3 py-1 font-semibold"
        >
          {thread.tribe.name}
        </Link>
      </header>

      <div className="mt-3">
        {thread.topic && <p className="text-body-l font-semibold">{thread.topic}</p>}
        {text && (
          <p className="text-body-s text-black-light mt-1 whitespace-pre-line">
            {expanded || !isLong ? text : `${text.slice(0, PREVIEW_CHARS)}...`}
          </p>
        )}
        {isLong && (
          <button
            type="button"
            className="text-light-green text-body-s mt-1 font-semibold"
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? "Show less" : "See more"}
          </button>
        )}
      </div>

      {thread.media?.length > 0 && <ImageCarousel images={thread.media} />}

      {thread.polls && (
        <Link
          href={tribeHref}
          className="bg-light_grey text-body-s mt-3 block rounded-xl p-3 font-semibold"
        >
          Poll: {thread.thread_polls?.title}. Open the tribe to vote.
        </Link>
      )}

      <footer className="text-text-grey mt-4 flex items-center gap-6">
        <button
          type="button"
          onClick={toggleLike}
          aria-pressed={hasLiked}
          aria-label="Like"
          className="text-body-s flex items-center gap-1.5"
        >
          <HeartIcon className={`h-5 w-5 ${hasLiked ? "fill-red-500 text-red-500" : ""}`} />
          {likes}
        </button>
        <Link href={tribeHref} className="text-body-s flex items-center gap-1.5" aria-label="Comments">
          <CommentIcon className="h-5 w-5" />
          {thread.comments}
        </Link>
        {!thread.from_joined_tribe && (
          <Link href={tribeHref} className="text-light-green text-body-s ml-auto font-semibold">
            Join tribe
          </Link>
        )}
      </footer>
    </article>
  );
}
