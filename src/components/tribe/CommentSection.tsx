import React, { useState } from 'react';
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import HeartIcon from "@/images/icons/heartIcon.svg";
import HeartFilledIcon from "@/images/icons/heartFilledIcon.svg";

import { useAppDispatch } from "@/redux/hook";

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
}

const CommentsSection: React.FC<CommentsProps> = ({ 
    comments, 
    isVisible, 
    onToggleVisibility,
    onLikeComment,
    onReplyToComment 
}) => {
    const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());

    const toggleReplies = (commentId: number) => {
        const newExpanded = new Set(expandedReplies);
        if (newExpanded.has(commentId)) {
            newExpanded.delete(commentId);
        } else {
            newExpanded.add(commentId);
        }
        setExpandedReplies(newExpanded);
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return date.toLocaleDateString();
    };

    const CommentItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({ comment, isReply = false }) => (
        <div className={`${isReply ? 'ml-12 mt-3' : 'mt-4'} first:mt-0`}>
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <Image 
                        src={comment.user.avatar} 
                        alt={comment.user.username}
                        width={isReply ? 32 : 40} 
                        height={isReply ? 32 : 40}
                        className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full border border-grey-90`}
                    />
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                    {/* User Info */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-black-light">
                            {comment.user.username}
                        </span>
                        {comment.user.verified && (
                            <Image src="/images/verified.png" alt="verified" width={12} height={12} />
                        )}
                        <DotIcon className="w-1 h-1 text-gray-400" />
                        <span className="text-xs text-gray-500">
                            {formatTimeAgo(comment.created_at)}
                        </span>
                        {comment.owner && (
                            <>
                                <DotIcon className="w-1 h-1 text-gray-400" />
                                <span className="text-xs text-light-green font-medium">Author</span>
                            </>
                        )}
                    </div>

                    {/* Comment Body */}
                    <div className="mb-3">
                        <p className="text-sm leading-relaxed text-black-light">
                            {comment.body}
                        </p>
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
                    {comment.children && 
                     comment.children.length > 0 && 
                     expandedReplies.has(comment.id) && (
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
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-base text-black-light">
                    Comments ({comments.length})
                </h3>
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
                    comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">No comments yet</p>
                        <p className="text-gray-400 text-xs mt-1">Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentsSection;