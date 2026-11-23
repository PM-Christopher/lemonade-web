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
import { useLikeThreadMutation, usePostCommentMutation } from "@/features/tribes/mutations";
import type { FeedThread } from "@/features/tribes/api";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { images } from "@/lib/images";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import { getInitials } from "@/lib/helper";

const TITLE_CHARS = 60;
const PREVIEW_CHARS = 100;

const cut = (value: string, limit: number) =>
  value.length > limit ? `${value.slice(0, limit).trimEnd()}...` : value;

/** One thread in the feed, with the tribe it came from and a way into that tribe. */
export function FeedCard({ thread }: { thread: FeedThread }) {
  const dispatch = useAppDispatch();
  const { push } = useNavigation();
  const likeMutation = useLikeThreadMutation();
  const commentMutation = usePostCommentMutation(thread.tribe.slug);
  const [hasLiked, setHasLiked] = useState(thread.hasLiked);
  const [likes, setLikes] = useState(thread.likes);
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

  // The whole card opens the tribe, except where the reader tapped a control inside it.
  const openTribe = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a, button, form")) return;
    push(tribeHref);
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
    <article
      onClick={openTribe}
      className="flex h-full w-full cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-none transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {author?.avatar ? (
            <FallbackImage
              src={author.avatar}
              fallbackSrc={images.AVATAR_4}
              alt="avatar"
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="bg-gradient-green flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white">
              {getInitials(author?.fullname)}
            </div>
          )}
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-sm font-semibold">
              <span className="truncate">{author?.username ?? author?.fullname}</span>
              {author?.verified && (
                <Image src={images.VERIFIED} alt="verified" width={13} height={13} />
              )}
            </p>
            <p className="text-meta text-gray-500">{thread.created_at}</p>
          </div>
        </div>
        <Link
          href={tribeHref}
          className="bg-light-tint text-light-green text-meta max-w-[45%] shrink-0 truncate rounded-full px-2.5 py-1 font-semibold"
        >
          {thread.tribe.name}
        </Link>
      </div>

      <div className="mt-3">
        {thread.topic && (
          <p className="text-body-s font-sans font-semibold">{cut(thread.topic, TITLE_CHARS)}</p>
        )}
        {text && (
          <p className="text-body-s text-black-light mt-1 whitespace-pre-line">
            {cut(text, PREVIEW_CHARS)}
          </p>
        )}
        {isLong && (
          <Link href={tribeHref} className="text-light-green text-body-s mt-1 inline-block">
            Read more
          </Link>
        )}
      </div>

      {thread.media?.length > 0 && (
        <Link
          href={tribeHref}
          className="relative mt-3 block h-44 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100"
        >
          <FallbackImage
            src={thread.media[0]}
            fallbackSrc={images.PLACEHOLDER}
            alt=""
            fill
            sizes="(min-width: 640px) 422px, 80vw"
            className="object-cover"
          />
          {thread.media.length > 1 && (
            <span className="text-meta absolute right-2 bottom-2 rounded-full bg-black/60 px-2 py-0.5 font-semibold text-white">
              +{thread.media.length - 1}
            </span>
          )}
        </Link>
      )}

      {thread.polls && (
        <Link
          href={tribeHref}
          className="text-body-s mt-3 block rounded-xl bg-white p-3 font-semibold"
        >
          Poll: {thread.thread_polls?.title}. Open the tribe to vote.
        </Link>
      )}

      <div className="mt-auto flex items-center justify-between pt-3">
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

        {!thread.from_joined_tribe && (
          <Link
            href={tribeHref}
            className="text-light-green text-body-s font-sans font-semibold transition-opacity hover:opacity-80"
          >
            Join tribe
          </Link>
        )}
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
