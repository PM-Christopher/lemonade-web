"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import MoreIcon from "@/images/icons/moreIcon.svg";
import chat_image from "@/images/icons/chat.png";
import HeartIcon from "@/images/icons/heartIcon.svg";
import HeartFilledIcon from "@/images/icons/heartFilledIcon.svg";
import VotedIcon from "@/images/icons/voteChecked.svg";
import NotVoted from "@/images/icons/notVoted.svg";
import FlagIcon from "@/images/icons/flagIcon.svg";
import UserIcon from "@/images/icons/userIcon.svg";
import TrashRedIcon from "@/images/icons/deleteRedTrash.svg";
import PinIcon from "@/images/icons/pinIcon.svg";

import { Thread } from "@/interfaces/TribeInterface";
import { useAppDispatch } from "@/redux/hook";


import ChatIcon from "@/images/icons/chatIcon.svg";
import {
  getComments,
  likeThread,
  postComment,
  removeTribeUser,
  setTribeUser,
  submitVote,
} from "@/features/tribes/tribe.slice";
import { useSelector } from "react-redux";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import ImageCarousel from "@/components/global/ImageCarousel";
import CommentsSection from "./CommentSection";

interface ModalPosition {
  top: number;
  left: number;
}

interface ThreadCardProps {
  thread: Thread;
  tribe_id: number;
  toggle: () => void;
  switchUserId: any;
  pinThread: any;
  toggleThreadId: (id: number) => void;
  toggleDeleteThread: (id: number) => void;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  thread,
  tribe_id,
  toggle,
  switchUserId,
  pinThread,
  toggleThreadId,
  toggleDeleteThread,
}) => {
  const dispatch = useAppDispatch();
  const { authToken } = useSelector((state: any) => state.auth);
  const [isExpanded, setIsExpanded] = useState(false); // State to track if text is expanded
  const charLimit = 200; // Set your desired character limit
  // const { comments } = useSelector((state: any) => state.tribe);

  const moreIconRef = useRef<HTMLDivElement | null>(null);
  const [modalPosition, setModalPosition] = useState<ModalPosition | null>(
    null
  );
  const [isModalVisible, setModalVisible] = useState(false);

  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  const handleSubmitComment = async (e: any) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      // Replace this with your Redux dispatch or API call
      dispatch(
        postComment({
          token: authToken,
          thread_id: thread.id,
          tribe_id: tribe_id,
          data: { body: comment },
        })
      ).then((res) => {
        if (res.payload.status) {
          setComment("");
          setShowCommentForm(false);
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Posted comment successfully",
              type: "success",
            })
          );
        }
      });
      // optionally hide form after posting
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMoreIconClick = () => {
    if (moreIconRef.current) {
      const rect = moreIconRef.current.getBoundingClientRect();
      const position: ModalPosition = {
        top: rect.top + window.scrollY + 25,
        left: rect.right + window.scrollX - 150, // Adjust modal position relative to the button
      };
      setModalPosition(position);
    }
    setModalVisible(!isModalVisible); // Toggle modal visibility
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded); // Toggle the expanded state
  };

  const postLike = () => {
    dispatch(
      likeThread({ id: thread?.id, tribe_id: tribe_id, token: authToken })
    );
  };

  const pollVote = (option_id: number) => {
    dispatch(
      submitVote({
        tribe_id,
        thread_id: thread.id,
        poll_id: thread.thread_polls.id,
        data: { option_id },
        token: authToken,
      })
    )
      .then((res: any) => {
        if (res.payload.status) {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Vote submitted",
              type: "success",
            })
          );
        } else {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error submitting vote",
              type: "error",
            })
          );
        }
      })
      .catch((error) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error.message || "Something went wrong. Please try again",
            type: "error",
          })
        );
      });
  };

  const handleLikeComment = (commentId: number) => {
    console.log("Liking comment:", commentId);
  };

  const handleReplyToComment = (commentId: number, parentId?: number) => {
    console.log("Replying to comment:", commentId, parentId);
  };

  const handleCommentClick = () => {
    // if (!showComments) {
    //   dispatch(
    //     getComments({
    //       thread_id: thread.id,
    //       tribe_id: tribe_id,
    //       token: authToken,
    //     })
    //   ).then((res: any) => {
    //     if (res.payload?.data) {
    //       setComments(res.payload.data);
    //     }
    //   });
    // }
    setShowComments(!showComments);
  };
  return (
    <div
      className="p-4 py-4 w-full h-full grid gap-[50px]"
      id={`pinned-${thread.id}`}
    >
      <div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <div>
              <Image
                src={thread?.created_by?.user?.avatar}
                alt=""
                width={48}
                height={48}
                className="w-[48px] h-[48px] rounded-[16px] border-[1px] border-grey-90"
              />
            </div>
            <div>
              <p className="font-semi-normal font-sans text-[14px] leading-[14.4px]">
                {thread?.created_by?.user?.username}
              </p>
            </div>
            {thread?.created_by.user.verified && (
              <div>
                <Image
                  src={"/images/verified.png"}
                  alt="verifed"
                  width={13}
                  height={13}
                />
              </div>
            )}
            <div>
              <DotIcon className="w-[3px] h-[3px]" />
            </div>
            <div>
              <p className="font-sans font-normal text-[12px] leading-[14.4px]">
                {thread?.created_at}
              </p>
            </div>
          </div>
          <div className="cursor-pointer" ref={moreIconRef}>
            <MoreIcon
              className="cursor-pointer"
              onClick={handleMoreIconClick}
            />
          </div>
        </div>
        <div className="mt-[4px]">
          <p className="font-sans font-semibold text-[14px] leading-[21px]">
            {thread?.topic}
          </p>
          <p className="font-sans font-normal leading-[21px] text-[14px] text-light-black mt-[30px]">
            {isExpanded ||
            !thread?.thoughts ||
            thread.thoughts.length <= charLimit
              ? thread?.thoughts
              : `${thread.thoughts.slice(0, charLimit)}...`}
          </p>
          {thread?.thoughts && thread.thoughts.length > charLimit && (
            <p
              className="font-sans font-semi-normal text-[14px] text-light-green cursor-pointer"
              onClick={handleToggle}
            >
              {isExpanded ? "see less" : "see more"}
            </p>
          )}
        </div>
        {thread?.media.length > 0 && (
          <ImageCarousel images={thread?.media} />
          // <div>
          //     <Image src={thread?.media[0]} alt="thread_image" width={736} height={540} objectFit="contain"
          //            className="w-[736px] h-[540px] rounded-[12px]" layout="responsive"/>
          // </div>
        )}

        {thread?.polls && thread?.thread_polls?.options.length > 0 && (
          <div className={"flex flex-col gap-2 mt-4"}>
            <p className={"font-medium text-[16px]"}>
              {thread?.thread_polls?.title}
            </p>
            {thread?.thread_polls?.options?.map((option, index) => (
              <div
                className="grid gap-2 mt-[16px] bg-light_grey rounded-[12px] cursor-pointer"
                onClick={() => pollVote(option.id)}
                key={index}
              >
                <div className="relative w-full h-[40px] bg-grey rounded-[8px] overflow-hidden">
                  {/* Background bar showing the percentage */}
                  <div
                    className="absolute top-0 left-0 h-full bg-light-green-90 rounded-[8px]"
                    style={{ width: `${option.vote_percentage}%` }}
                  ></div>
                  {/* Content of the option */}
                  <div className="relative z-10 flex justify-between items-center p-3">
                    <div className="flex gap-2 items-center">
                      {thread?.thread_polls.has_voted &&
                        (thread.thread_polls.user_vote?.id === option.id ? (
                          <VotedIcon className="w-[20px] h-[20px]" />
                        ) : (
                          <NotVoted className="w-[20px] h-[20px]" />
                        ))}

                      <p className="font-semi-normal text-[14px]">
                        {option.content}
                      </p>
                    </div>
                    <p className="font-semi-normal text-[14px]">
                      {option.vote_percentage}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {thread?.polls && (
          <div className="mt-2">
            <p className="text-text-grey text-[12px] font-semi-normal">
              {`${thread?.thread_polls.total_votes} vote${
                thread?.thread_polls.total_votes === 1 ? "" : "s"
              }`}
            </p>
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-2">
        <div
          className="rounded-[12px] bg-light_grey p-[4px] px-[8px] w-[64px] h-[30px] flex justify-center items-center cursor-pointer"
          onClick={postLike}
        >
          {thread?.hasLiked ? <HeartFilledIcon /> : <HeartIcon className="" />}
        </div>
        <div
          className="rounded-[12px] bg-light_grey p-[4px] px-[8px] w-[64px] h-[30px] flex justify-center items-center cursor-pointer"
          onClick={() => setShowCommentForm(!showCommentForm)}
        >
          {/* <Image src={chat_image} alt="comment" /> */}

          <ChatIcon/>

        </div>

      
      </div>

      <CommentsSection
        comments={thread?.all_comments}
        isVisible={true}
        onToggleVisibility={() => setShowComments(false)}
        onLikeComment={handleLikeComment}
        onReplyToComment={handleReplyToComment}
      />
      <div>
        {showCommentForm && (
          <form onSubmit={handleSubmitComment} className="flex flex-col gap-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="border-[1px] border-grey-90 rounded-[8px] p-2 w-full h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-light-green"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="text-[14px] text-black-light px-3 py-1 rounded-[8px] border-[1px] border-grey-90"
                onClick={() => setShowCommentForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="bg-light-green text-white rounded-[8px] px-4 py-2 font-medium text-[14px] disabled:opacity-60"
              >
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        )}
      </div>
      {isModalVisible && modalPosition && (
        <div
          className="absolute bg-white shadow-lg z-10 rounded-[12px] flex flex-col w-[170px]"
          style={{
            top: modalPosition.top,
            left: modalPosition.left,
            minWidth: "150px",
          }}
        >
          {!thread?.owner && (
            <div
              className="p-[12px] px-[16px] flex gap-[8px] items-center cursor-pointer"
              onClick={() => switchUserId(thread?.created_by?.user?.id)}
            >
              <UserIcon className="w-[16.25px] h-[16.25px]" />
              <p className="font-normal text-[16px] text-black-light">
                View profile
              </p>
            </div>
          )}

          <div
            className="p-[12px] px-[16px] flex gap-[8px] items-center cursor-pointer"
            onClick={() => pinThread(thread?.id)}
          >
            <PinIcon className="w-[16.25px] h-[16.25px]" />
            <p className="font-normal text-[16px] text-black-light">
              {thread?.pinned ? "Unpin" : "Pin"} Thread
            </p>
          </div>

          <div
            className="p-[12px] px-[16px] flex gap-[8px] items-center cursor-pointer"
            onClick={() => toggleThreadId(thread?.id)}
          >
            <FlagIcon className="w-[16.25px] h-[16.25px]" />
            <p className="font-normal text-[16px] text-black-light">
              Report Thread
            </p>
          </div>

          {thread?.owner && (
            <>
              <div
                className="p-[12px] px-[16px] flex gap-[8px] items-center cursor-pointer"
                onClick={() => toggleDeleteThread(thread?.id)}
              >
                <TrashRedIcon className="w-[16.25px] h-[16.25px]" />
                <p className="text-red-1 font-normal text-[16px]">
                  Delete thread
                </p>
              </div>
            </>
          )}
        </div>
      )}
      <div className="w-full border-b-[1px]"></div>
    </div>
  );
};

export default ThreadCard;
