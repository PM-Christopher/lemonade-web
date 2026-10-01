import React, { useEffect, useState } from "react";
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import moment from "moment";

import { getInitials } from "@/lib/helper";
import { Thread } from "@/interfaces/TribeInterface";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Comment {
  id: number;
  thread_id: number;
  owner: boolean;
  body: string;
  user_id: number;
  user: {
    fullname: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  created_at: string;
  likes: number;
  hasLikedComment: boolean;
  children: Comment[];
}

interface CommentsProps {
  comments: Comment[];
  isVisible: boolean;
  onToggleVisibility: () => void;
  onLikeComment?: (commentId: number) => void;
  onReplyToComment?: (commentId: number, parentId?: number) => void;
  thread: Thread | null;
}

const CommentsSection: React.FC<CommentsProps> = ({ comments, isVisible }) => {
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());

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

  const CommentItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({
    comment,
    isReply = false,
  }) => (
    <div className={`${isReply ? "mt-3 ml-12" : "mt-4"} first:mt-0`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`${
              isReply ? "h-8 w-8" : "h-10 w-10"
            } border-grey-90 flex items-center justify-center overflow-hidden rounded-full border bg-gray-200 text-[12px] font-semibold text-gray-700`}
          >
            {comment.user.avatar ? (
              <Image
                src={comment.user.avatar}
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
              <Image src="/images/verified.png" alt="verified" width={12} height={12} />
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
            <p className="text-black-light text-sm leading-relaxed">{comment.body}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
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
              {comment.children.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
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
      <div className="space-y-0">
        {comments.length > 0 ? (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
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
