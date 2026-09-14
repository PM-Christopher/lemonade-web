"use client";
import React, {useCallback, useEffect, useRef, useState} from "react";
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
import {useAppDispatch} from "@/redux/hook";
import {
    usePostCommentMutation,
    useLikeThreadMutation,
    useSubmitVoteMutation,
} from "@/features/tribes/mutations";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import type {Thread, TribeInterface} from "@/interfaces/TribeInterface";
import {getInitials} from "@/lib/helper";

interface ModalPosition {
    top: number;
    left: number;
}

interface ThreadCardProps {
    thread: Thread;
    tribe_id: number | any;
    toggle: () => void;
    switchUserId: (id: number) => void;
    pinThread: (id: number) => void;
    toggleThreadId: (id: number) => void;
    toggleDeleteThread: (id: number) => void;
    tribe: TribeInterface | null
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
                tribeId: tribe_id,
                threadId: thread.id,
                data: {body: comment},
            });
            setComment("");
            setShowCommentForm(false);
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Posted comment successfully",
                    type: "success",
                })
            );
        } catch {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Failed to post comment",
                    type: "error",
                })
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
            await likeThreadMutation.mutateAsync({tribeId: tribe_id, threadId: thread.id});
        } catch {
            setHasLiked(prevLiked);
            setLikeCount(prevCount);
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: "Failed to like post",
                    type: "error",
                })
            );
        }
    }, [hasLiked, likeCount, thread.id, tribe_id, likeThreadMutation, dispatch]);

    // --- Poll vote
    const pollVote = (option_id: number) =>
        submitVoteMutation.mutate(
            {tribeId: tribe_id, threadId: thread.id, pollId: thread.thread_polls.id, data: {option_id}},
            {
                onSuccess: () =>
                    dispatch(
                        updateToastifyReducer({show: true, message: "Vote submitted", type: "success"})
                    ),
                onError: () =>
                    dispatch(
                        updateToastifyReducer({show: true, message: "Error submitting vote", type: "error"})
                    ),
            }
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
        <div className="p-4 w-full h-full grid gap-8" id={`pinned-${thread.id}`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {
                        thread?.created_by?.user?.avatar ? (
                            <Image
                                src={thread?.created_by?.user?.avatar || "/default-avatar.png"}
                                alt="avatar"
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-2xl border border-gray-200"
                            />
                        ) : (
                            <div
                                className="flex items-center justify-center rounded-full border-[2px] border-[#3B4152] w-[40px] h-[40px]
                   text-sm font-medium text-white bg-gradient-green
                   transition-all duration-300 ease-in-out
                   group-hover:scale-110 group-hover:border-green-400
                   group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)] group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-600"
                            >
                                <p className="text-[18px] font-ruso">{getInitials(thread?.created_by?.user?.fullname)}</p>
                            </div>
                        )
                    }

                    <div className="flex items-center gap-1">
                        <p className="font-semibold text-sm">
                            {thread?.created_by?.user?.username}
                        </p>
                        {thread?.created_by?.user?.verified && (
                            <Image src="/images/verified.png" alt="verified" width={13} height={13}/>
                        )}
                    </div>
                    <span className="text-xs text-gray-500">{thread?.created_at}</span>
                </div>
                <div ref={moreIconRef}>
                    <MoreIcon className="cursor-pointer w-5 h-5" onClick={handleMoreIconClick}/>
                </div>
            </div>

            {/* Content */}
            <div>
                <p className="font-semibold text-sm">{thread?.topic}</p>
                <p className="text-gray-700 text-sm mt-2">
                    {isExpanded ? thread.thoughts : truncatedText}
                </p>
                {thread?.thoughts && thread.thoughts.length > charLimit && (
                    <button
                        className="text-light-green text-sm mt-1"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? "See less" : "See more"}
                    </button>
                )}
            </div>

            {thread?.media?.length > 0 && <ImageCarousel images={thread.media}/>}

            {/* Polls */}
            {thread?.polls && thread?.thread_polls?.options?.length > 0 && (
                <div className="mt-4 space-y-3">
                    <p className="font-medium text-base">{thread.thread_polls.title}</p>
                    {thread.thread_polls.options.map((opt) => (
                        <div
                            key={opt.id}
                            className="relative w-full h-10 bg-gray-100 rounded-lg cursor-pointer overflow-hidden"
                            onClick={() => pollVote(opt.id)}
                        >
                            <div
                                className="absolute top-0 left-0 h-full bg-light-green-90 transition-all"
                                style={{width: `${opt.vote_percentage}%`}}
                            />
                            <div className="relative z-10 flex justify-between items-center px-3 h-full">
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
                    className="flex items-center gap-1 bg-gray-100 rounded-lg px-3 py-1.5"
                >
                    {hasLiked ? (
                        <HeartIcon className="text-green-400 fill-green-400 w-5 h-5"/>
                    ) : (
                        <HeartIcon className="w-5 h-5"/>
                    )}
                    <span className="text-sm">{likeCount}</span>
                </button>

                <button
                    onClick={() => setShowCommentForm(!showCommentForm)}
                    className="flex items-center gap-1 bg-gray-100 rounded-lg px-3 py-1.5"
                >
                    <ChatIcon className="w-5 h-5"/>
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
              className="border border-gray-300 rounded-md p-2 w-full h-20 resize-none focus:ring-1 focus:ring-light-green"
          />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowCommentForm(false)}
                            className="text-sm px-3 py-1 border border-gray-300 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !comment.trim()}
                            className="bg-light-green text-white text-sm px-4 py-1.5 rounded-md disabled:opacity-60"
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
                    className="absolute bg-white shadow-lg z-10 rounded-xl w-44"
                    style={{top: modalPosition.top, left: modalPosition.left}}
                >
                    {!thread?.owner && (
                        <ModalItem
                            icon={<UserIcon size={16}/>}
                            label="View profile"
                            onClick={() => switchUserId(thread.created_by.user.id)}
                        />
                    )}
                    {
                        tribe?.has_joined && (
                            <>
                                <ModalItem
                                    icon={<PinIcon size={16}/>}
                                    label={thread?.pinned ? "Unpin Thread" : "Pin Thread"}
                                    onClick={() => pinThread(thread.id)}
                                />
                                <ModalItem
                                    icon={<FlagIcon size={16}/>}
                                    label="Report Thread"
                                    onClick={() => toggleThreadId(thread.id)}
                                />
                            </>
                        )
                    }
                    {thread?.owner && (
                        <ModalItem
                            icon={<TrashIcon size={16} className="text-red-500"/>}
                            label="Delete Thread"
                            danger
                            onClick={() => toggleDeleteThread(thread.id)}
                        />
                    )}
                </div>
            )}
            <div className="w-full border-b"/>
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
        className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 ${
            danger ? "text-red-500 hover:bg-red-50" : "text-gray-800"
        }`}
    >
        {icon}
        <span className="text-sm">{label}</span>
    </div>
);

export default ThreadCard;
