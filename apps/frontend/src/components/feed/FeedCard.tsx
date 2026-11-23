"use client";
import React, { useState } from "react";
import Image from "next/image";
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
    <article className="bg-light-yellow flex w-full flex-col rounded-2xl p-4 shadow-none">
      <div className="flex items-center gap-3">
        <Link href={tribeHref} className="flex min-w-0 items-center gap-3">
          <FallbackImage
            src={thread.tribe.image}
            fallbackSrc={images.DEFAULT_TRIBE}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-lg object-cover"
          />
          <p className="text-text-grey text-meta truncate font-sans font-semibold">
            {thread.tribe.name}
          </p>
        </Link>
      </div>
      <p className="text-meta mt-2 flex items-center gap-1 text-gray-500">
        <span className="truncate">{author?.username ?? author?.fullname}</span>
        {author?.verified && <Image src={images.VERIFIED} alt="verified" width={12} height={12} />}
        <span>· {thread.created_at}</span>
      </p>

      <div className="mt-2">
        {thread.topic && <p className="text-body-s font-sans font-semibold">{thread.topic}</p>}
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
            {expanded ? "See less" : "See more"}
          </button>
        )}
      </div>

      {thread.media?.length > 0 && <ImageCarousel images={thread.media} />}

      {thread.polls && (
        <Link
          href={tribeHref}
          className="text-body-s mt-3 block rounded-xl bg-white p-3 font-semibold"
        >
          Poll: {thread.thread_polls?.title}. Open the tribe to vote.
        </Link>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLike}
            aria-pressed={hasLiked}
            aria-label="Like"
            className="text-light-black text-body-s flex items-center gap-1 font-sans"
          >
            <HeartIcon className={`h-4 w-4 ${hasLiked ? "fill-green-400 text-green-400" : ""}`} />
            {likes}
          </button>
          {thread.from_joined_tribe ? (
            <button
              type="button"
              onClick={() => setCommentOpen((open) => !open)}
              aria-expanded={commentOpen}
              aria-label="Comment"
              className="text-light-black text-body-s flex items-center gap-1 font-sans"
            >
              <CommentIcon className="h-4 w-4" />
              {comments}
            </button>
          ) : (
            <Link
              href={tribeHref}
              aria-label="Comments"
              className="text-light-black text-body-s flex items-center gap-1 font-sans"
            >
              <CommentIcon className="h-4 w-4" />
              {comments}
            </Link>
          )}
          <button
            type="button"
            onClick={share}
            aria-label="Share"
            className="text-light-black flex items-center"
          >
            <ShareIcon className="h-4 w-4" />
          </button>
        </div>

        <Link
          href={tribeHref}
          className="text-light-green text-body-s flex items-center gap-1 font-sans font-semibold transition-opacity hover:opacity-80"
        >
          {thread.from_joined_tribe ? "View" : "Join tribe"}
          <Image src={images.ARROW_LEFT} alt="" width={12.5} height={12.5} className="h-3 w-3" />
        </Link>
      </div>

      {commentOpen && (
        <form onSubmit={submitComment} className="mt-3 flex flex-col gap-2">
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Write a comment..."
            aria-label="Write a comment"
            maxLength={1000}
            className="focus:ring-light-green h-20 w-full resize-none rounded-md border border-gray-300 bg-white p-2 focus:ring-1"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCommentOpen(false)}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={commentMutation.isPending || !comment.trim()}
              className="bg-light-green rounded-md px-4 py-1.5 text-sm text-white disabled:opacity-60"
            >
              {commentMutation.isPending ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      )}
    </article>
  );
}
