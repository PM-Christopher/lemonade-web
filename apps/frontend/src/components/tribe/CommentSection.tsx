import { images } from "@/lib/images";
import { FallbackImage } from "@/components/global/FallbackImage";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import moment from "moment";

import { getInitials } from "@/lib/helper";
import { Thread } from "@/interfaces/TribeInterface";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { errorMessage } from "@/lib/api-error";
import { useDeleteCommentMutation, useEditCommentMutation } from "@/features/tribes/mutations";

interface Comment {
  id: string;
  thread_id: string;
  owner: boolean;
  body: string;
  user_id: string;
  user: {
    fullname: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  created_at: string;
  likes: number;
  hasLikedComment: boolean;
  edited_at?: string | null;
  children: Comment[];
}

interface CommentsProps {
  comments: Comment[];
  isVisible: boolean;
  onToggleVisibility: () => void;
  onLikeComment?: (commentId: string) => void;
  onReplyToComment?: (commentId: string, parentId?: string) => void;
  thread: Thread | null;
  // The tribe's slug, to keep its cached threads in step after an edit or delete.
  tribeSlug: string;
}

const CommentsSection: React.FC<CommentsProps> = ({ comments, isVisible, thread, tribeSlug }) => {
  const dispatch = useAppDispatch();
  const editMutation = useEditCommentMutation(tribeSlug, thread?.id ?? "");
  const deleteMutation = useDeleteCommentMutation(tribeSlug, thread?.id ?? "");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toast = (message: string, type: "success" | "error") =>
    dispatch(updateToastifyReducer({ show: true, message, type }));

  const saveEdit = (id: string) => {
    const body = draft.trim();
    if (!body) return;
    editMutation.mutate(
      { id, body },
      {
        onSuccess: () => {
          setEditingId(null);
          toast("Comment updated", "success");
        },
        onError: (error) => toast(errorMessage(error, "Could not update comment"), "error"),
      },
    );
  };

  const confirmDelete = (id: string) =>
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setDeletingId(null);
        toast("Comment deleted", "success");
      },
      onError: (error) => toast(errorMessage(error, "Could not delete comment"), "error"),
    });

  const [expandedReplies] = useState<Set<string>>(new Set());

  // This state forces re-render every minute
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1);
    }, 60000); // 60,000 ms = 1 minute

    return () => clearInterval(interval);
  }, []);

  const { user } = useSelector((state: RootState) => state.auth);

  const formatTimeAgo = (dateString: string) => {
    const date = moment(dateString);
    const now = moment();

    const diffInMinutes = now.diff(date, "minutes");

    if (diffInMinutes < 1) return "Just now";

    return date.fromNow(); // e.g. "2 hours ago", "3 days ago"
  };

  // A plain render function, not a component, so typing in an edit box keeps its focus.
  const renderComment = (comment: Comment, isReply = false): React.ReactNode => (
    <div key={comment.id} className={`${isReply ? "mt-3 ml-12" : "mt-4"} first:mt-0`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`${
              isReply ? "h-8 w-8" : "h-10 w-10"
            } border-grey-90 text-meta flex items-center justify-center overflow-hidden rounded-full border bg-gray-200 leading-normal font-semibold text-gray-700`}
          >
            {comment.user.avatar ? (
              <FallbackImage
                src={comment.user.avatar}
                fallbackSrc={images.AVATAR_4}
                alt={comment.user.username}
                width={isReply ? 32 : 40}
                height={isReply ? 32 : 40}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(comment.user.fullname)
            )}
          </div>
        </div>

        {/* Comment Content */}
        <div className="min-w-0 flex-1">
          {/* User Info */}
          <div className="mb-1 flex items-center gap-2">
            <span className="text-black-light text-sm font-semibold">{comment.user.username}</span>
            {comment.user.verified && (
              <Image src={images.VERIFIED} alt="verified" width={12} height={12} />
            )}
            <DotIcon className="h-1 w-1 text-gray-400" />
            <span className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</span>
            {comment?.user_id === user?.id && (
              <>
                <DotIcon className="h-1 w-1 text-gray-400" />
                <span className="text-light-green text-xs font-medium">Author</span>
              </>
            )}
          </div>

          {/* Comment Body */}
          <div className="mb-3">
            {editingId === comment.id ? (
              <div className="flex flex-col gap-2">
                <textarea
                  aria-label="Edit comment"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  className="focus:ring-light-green h-20 w-full resize-none rounded-md border border-gray-300 p-2 text-sm focus:ring-1"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={editMutation.isPending || !draft.trim()}
                    onClick={() => saveEdit(comment.id)}
                    className="bg-light-green rounded-md px-3 py-1 text-xs text-white disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-md border border-gray-300 px-3 py-1 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-black-light text-sm leading-relaxed">
                {comment.body}
                {comment.edited_at && <span className="ml-2 text-xs text-gray-400">(edited)</span>}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {comment.user_id === user?.id && editingId !== comment.id && (
              <>
                {deletingId === comment.id ? (
                  <span className="flex items-center gap-2 text-xs text-gray-600">
                    Delete this comment?
                    <button
                      type="button"
                      disabled={deleteMutation.isPending}
                      onClick={() => confirmDelete(comment.id)}
                      className="font-medium text-red-500"
                    >
                      Yes
                    </button>
                    <button type="button" onClick={() => setDeletingId(null)}>
                      No
                    </button>
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setDraft(comment.body);
                        setEditingId(comment.id);
                      }}
                      className="hover:text-light-green text-xs text-gray-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(comment.id)}
                      className="text-xs text-gray-500 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
            {/* Like Button */}
            {/* <button
                            onClick={() => onLikeComment?.(comment.id)}
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-light-green transition-colors"
                        >
                            {comment.hasLikedComment ? (
                                <HeartFilledIcon className="w-4 h-4 text-red-500" />
                            ) : (
                                <HeartIcon className="w-4 h-4" />
                            )}
                            {comment.likes > 0 && (
                                <span className={comment.hasLikedComment ? 'text-red-500' : ''}>
                                    {comment.likes}
                                </span>
                            )}
                        </button> */}

            {/* Reply Button */}
            {/* <button
                            onClick={() => onReplyToComment?.(comment.id)}
                            className="text-xs text-gray-500 hover:text-light-green transition-colors"
                        >
                            Reply
                        </button> */}

            {/* Show Replies Button */}
            {/* {comment.children && comment.children.length > 0 && (
                            <button
                                onClick={() => toggleReplies(comment.id)}
                                className="text-xs text-light-green hover:text-green-600 transition-colors"
                            >
                                {expandedReplies.has(comment.id) 
                                    ? `Hide ${comment.children.length} ${comment.children.length === 1 ? 'reply' : 'replies'}`
                                    : `Show ${comment.children.length} ${comment.children.length === 1 ? 'reply' : 'replies'}`
                                }
                            </button>
                        )} */}
          </div>

          {/* Nested Replies */}
          {comment.children && comment.children.length > 0 && expandedReplies.has(comment.id) && (
            <div className="mt-3 space-y-3">
              {comment.children.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!isVisible) return null;

  return (
    <div className="mt-6 border-t border-gray-100 pt-4">
      {/* Comments Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-black-light text-base font-semibold">Comments ({comments.length})</h3>
        {/* <button
                    onClick={onToggleVisibility}
                    className="text-sm text-gray-500 hover:text-light-green transition-colors"
                >
                    Hide comments
                </button> */}
      </div>

      {/* Comments List */}
      <div className="hide-scrollbar max-h-96 space-y-0 overflow-y-auto">
        {comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">No comments yet</p>
            <p className="mt-1 text-xs text-gray-400">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
