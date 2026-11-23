"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Heart as HeartIcon,
  MessageCircle as CommentIcon,
  Share2 as ShareIcon,
} from "lucide-react";
import { FallbackImage } from "@/components/global/FallbackImage";
import ImageCarousel from "@/components/global/ImageCarousel";
import { useLikeThreadMutation, usePostCommentMutation } from "@/features/tribes/mutations";
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
  const commentMutation = usePostCommentMutation(thread.tribe.slug);
  const [hasLiked, setHasLiked] = useState(thread.hasLiked);
  const [likes, setLikes] = useState(thread.likes);
  const [expanded, setExpanded] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(thread.comments);

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
          dispatch(
            updateToastifyReducer({ show: true, message: "Failed to like post", type: "error" }),
          );
        },
      },
    );
  };

  const submitComment = (event: React.FormEvent) => {
    event.preventDefault();
    const body = comment.trim();
    if (!body) return;
    commentMutation.mutate(
      { tribeId: thread.tribe.id, threadId: thread.id, data: { body } },
      {
        onSuccess: () => {
          setComment("");
          setCommentOpen(false);
          setComments((count) => count + 1);
          dispatch(
            updateToastifyReducer({ show: true, message: "Comment posted", type: "success" }),
          );
        },
        onError: () =>
          dispatch(
            updateToastifyReducer({ show: true, message: "Failed to post comment", type: "error" }),
          ),
      },
    );
  };

  // Shares the tribe's public page, since a post itself has no public link.
  const share = async () => {
    const url = `${window.location.origin}/share/tribe/${thread.tribe.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: thread.topic || thread.tribe.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        dispatch(updateToastifyReducer({ show: true, message: "Link copied", type: "success" }));
      }
    } catch {
      // The reader closed the share sheet, so there is nothing to report.
    }
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
          <p className="text-body-s truncate font-semibold">
            {author?.username ?? author?.fullname}
          </p>
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
        {thread.from_joined_tribe ? (
          <button
            type="button"
            onClick={() => setCommentOpen((open) => !open)}
            aria-expanded={commentOpen}
            aria-label="Comment"
            className="text-body-s flex items-center gap-1.5"
          >
            <CommentIcon className="h-5 w-5" />
            {comments}
          </button>
        ) : (
          <Link
            href={tribeHref}
            className="text-body-s flex items-center gap-1.5"
            aria-label="Comments"
          >
            <CommentIcon className="h-5 w-5" />
            {comments}
          </Link>
        )}
        <button
          type="button"
          onClick={share}
          aria-label="Share"
          className="text-body-s flex items-center"
        >
          <ShareIcon className="h-5 w-5" />
        </button>
        {!thread.from_joined_tribe && (
          <Link href={tribeHref} className="text-light-green text-body-s ml-auto font-semibold">
            Join tribe
          </Link>
        )}
      </footer>

      {commentOpen && (
        <form onSubmit={submitComment} className="mt-3 flex gap-2">
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Write a comment"
            aria-label="Write a comment"
            maxLength={1000}
            className="form-font bg-light_grey text-body-s h-10 min-w-0 flex-1 rounded-xl px-3"
          />
          <button
            type="submit"
            disabled={commentMutation.isPending || !comment.trim()}
            className="bg-gradient-green text-body-s h-10 rounded-xl px-4 font-semibold text-white disabled:opacity-50"
          >
            Post
          </button>
        </form>
      )}
    </article>
  );
}
