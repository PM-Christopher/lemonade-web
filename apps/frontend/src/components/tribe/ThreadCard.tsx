"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Heart as HeartIcon,
  MessageCircle as ChatIcon,
  MoreVertical as MoreIcon,
  Flag as FlagIcon,
  Trash2 as TrashIcon,
  Pin as PinIcon,
  User as UserIcon,
} from "lucide-react";
import ImageCarousel from "@/components/global/ImageCarousel";
import CommentsSection from "./CommentSection";
import { useAppDispatch } from "@/redux/hook";
import {
  usePostCommentMutation,
  useLikeThreadMutation,
  useSubmitVoteMutation,
} from "@/features/tribes/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import type { Thread, TribeInterface } from "@/interfaces/TribeInterface";
import { getInitials } from "@/lib/helper";

interface ModalPosition {
  top: number;
  left: number;
}

interface ThreadCardProps {
  thread: Thread;
  tribe_id: number | undefined;
  toggle: () => void;
  switchUserId: (id: number) => void;
  pinThread: (id: number) => void;
  toggleThreadId: (id: number) => void;
  toggleDeleteThread: (id: number) => void;
  tribe: TribeInterface | null;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  thread,
  tribe,
  tribe_id,
  switchUserId,
  pinThread,
  toggleThreadId,
  toggleDeleteThread,
}) => {
  const dispatch = useAppDispatch();
  // tribe_id (the tribe's raw id) is what LikeTribeThread/VoteOnTribePoll/
  // CommentOnTribeThread actually require in the URL; tribe?.slug is what
  // useThreadsQuery/usePinnedThreadsQuery are keyed by — the two are
  // different identifiers on the backend (see mutations.ts's comment).
  const postCommentMutation = usePostCommentMutation(tribe?.slug ?? "");
  const likeThreadMutation = useLikeThreadMutation();
  const submitVoteMutation = useSubmitVoteMutation(tribe?.slug ?? "");

  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [hasLiked, setHasLiked] = useState(thread?.hasLiked || false);
  const [likeCount, setLikeCount] = useState(thread?.likes || 0);

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState<ModalPosition | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const moreIconRef = useRef<HTMLDivElement>(null);

  // --- Modal close on outside click or Esc
  useEffect(() => {
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (
        e instanceof KeyboardEvent
          ? e.key === "Escape"
          : modalRef.current &&
            moreIconRef.current &&
            !modalRef.current.contains(e.target as Node) &&
            !moreIconRef.current.contains(e.target as Node)
      ) {
        setModalVisible(false);
      }
    };
    if (isModalVisible) {
      document.addEventListener("mousedown", close);
      document.addEventListener("keydown", close);
    }
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [isModalVisible]);

  // --- Comment submit
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await postCommentMutation.mutateAsync({
        tribeId: tribe_id as number,
        threadId: thread.id,
        data: { body: comment },
      });
      setComment("");
      setShowCommentForm(false);
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Posted comment successfully",
          type: "success",
        }),
      );
    } catch {
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Failed to post comment",
          type: "error",
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --- Likes (optimistic update)
  const postLike = useCallback(async () => {
    const prevLiked = hasLiked;
    const prevCount = likeCount;
    setHasLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      await likeThreadMutation.mutateAsync({ tribeId: tribe_id as number, threadId: thread.id });
    } catch {
      setHasLiked(prevLiked);
      setLikeCount(prevCount);
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Failed to like post",
          type: "error",
        }),
      );
    }
  }, [hasLiked, likeCount, thread.id, tribe_id, likeThreadMutation, dispatch]);

  // --- Poll vote
  const pollVote = (option_id: number) =>
    submitVoteMutation.mutate(
      {
        tribeId: tribe_id as number,
        threadId: thread.id,
        pollId: thread.thread_polls.id,
        data: { option_id },
      },
      {
        onSuccess: () =>
          dispatch(
            updateToastifyReducer({ show: true, message: "Vote submitted", type: "success" }),
          ),
        onError: () =>
          dispatch(
            updateToastifyReducer({ show: true, message: "Error submitting vote", type: "error" }),
          ),
      },
    );

  // --- Modal open positioning
  const handleMoreIconClick = () => {
    if (!moreIconRef.current) return;
    const rect = moreIconRef.current.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY + 25,
      left: rect.right + window.scrollX - 150,
    });
    setModalVisible(!isModalVisible);
  };

  const charLimit = 200;
  const truncatedText =
    !thread.thoughts || thread.thoughts.length <= charLimit
      ? thread.thoughts
      : `${thread.thoughts.slice(0, charLimit)}...`;

  return (
    <div className="grid h-full w-full gap-8 p-4" id={`pinned-${thread.id}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {thread?.created_by?.user?.avatar ? (
            <Image
              src={thread?.created_by?.user?.avatar || "/default-avatar.png"}
              alt="avatar"
              width={48}
              height={48}
              className="h-12 w-12 rounded-2xl border border-gray-200"
            />
          ) : (
            <div className="bg-gradient-green flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#3B4152] text-sm font-medium text-white transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-600 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]">
              <p className="font-ruso text-[18px]">
                {getInitials(thread?.created_by?.user?.fullname)}
              </p>
            </div>
          )}

          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold">{thread?.created_by?.user?.username}</p>
            {thread?.created_by?.user?.verified && (
              <Image src="/images/verified.png" alt="verified" width={13} height={13} />
            )}
          </div>
          <span className="text-xs text-gray-500">{thread?.created_at}</span>
        </div>
        <div ref={moreIconRef}>
          <MoreIcon className="h-5 w-5 cursor-pointer" onClick={handleMoreIconClick} />
        </div>
      </div>

      {/* Content */}
      <div>
        <p className="text-sm font-semibold">{thread?.topic}</p>
        <p className="mt-2 text-sm text-gray-700">{isExpanded ? thread.thoughts : truncatedText}</p>
        {thread?.thoughts && thread.thoughts.length > charLimit && (
          <button
            className="text-light-green mt-1 text-sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "See less" : "See more"}
          </button>
        )}
      </div>

      {thread?.media?.length > 0 && <ImageCarousel images={thread.media} />}

      {/* Polls */}
      {thread?.polls && thread?.thread_polls?.options?.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-base font-medium">{thread.thread_polls.title}</p>
          {thread.thread_polls.options.map((opt) => (
            <div
              key={opt.id}
              className="relative h-10 w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100"
              onClick={() => pollVote(opt.id)}
            >
              <div
                className="bg-light-green-90 absolute top-0 left-0 h-full transition-all"
                style={{ width: `${opt.vote_percentage}%` }}
              />
              <div className="relative z-10 flex h-full items-center justify-between px-3">
                <span>{opt.content}</span>
                <span>{opt.vote_percentage}%</span>
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-500">
            {thread.thread_polls.total_votes} vote
            {thread.thread_polls.total_votes !== 1 && "s"}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={postLike}
          className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5"
        >
          {hasLiked ? (
            <HeartIcon className="h-5 w-5 fill-green-400 text-green-400" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          <span className="text-sm">{likeCount}</span>
        </button>

        <button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5"
        >
          <ChatIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Comments */}
      <CommentsSection
        comments={thread?.all_comments}
        isVisible={true}
        onToggleVisibility={() => null}
        onLikeComment={() => null}
        onReplyToComment={() => null}
        thread={thread}
      />

      {/* Comment Form */}
      {showCommentForm && (
        <form onSubmit={handleSubmitComment} className="flex flex-col gap-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="focus:ring-light-green h-20 w-full resize-none rounded-md border border-gray-300 p-2 focus:ring-1"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCommentForm(false)}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="bg-light-green rounded-md px-4 py-1.5 text-sm text-white disabled:opacity-60"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      )}

      {/* Modal */}
      {isModalVisible && modalPosition && (
        <div
          ref={modalRef}
          className="absolute z-10 w-44 rounded-xl bg-white shadow-lg"
          style={{ top: modalPosition.top, left: modalPosition.left }}
        >
          {!thread?.owner && (
            <ModalItem
              icon={<UserIcon size={16} />}
              label="View profile"
              onClick={() => switchUserId(thread.created_by.user.id)}
            />
          )}
          {tribe?.has_joined && (
            <>
              <ModalItem
                icon={<PinIcon size={16} />}
                label={thread?.pinned ? "Unpin Thread" : "Pin Thread"}
                onClick={() => pinThread(thread.id)}
              />
              <ModalItem
                icon={<FlagIcon size={16} />}
                label="Report Thread"
                onClick={() => toggleThreadId(thread.id)}
              />
            </>
          )}
          {thread?.owner && (
            <ModalItem
              icon={<TrashIcon size={16} className="text-red-500" />}
              label="Delete Thread"
              danger
              onClick={() => toggleDeleteThread(thread.id)}
            />
          )}
        </div>
      )}
      <div className="w-full border-b" />
    </div>
  );
};

// Reusable modal item
const ModalItem = ({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) => (
  <div
    onClick={onClick}
    className={`flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-50 ${
      danger ? "text-red-500 hover:bg-red-50" : "text-gray-800"
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

export default ThreadCard;
