"use client"
import React, {useEffect, useRef, useState} from 'react';
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import MoreIcon from "@/images/icons/moreIcon.svg";
import chat_image from "@/images/icons/chat.png";
import HeartIcon from "@/images/icons/heartIcon.svg"
import HeartFilledIcon from "@/images/icons/heartFilledIcon.svg"
import VotedIcon from "@/images/icons/voteChecked.svg"
import NotVoted from "@/images/icons/notVoted.svg"
import FlagIcon from "@/images/icons/flagIcon.svg"
import UserIcon from "@/images/icons/userIcon.svg"
import TrashRedIcon from "@/images/icons/deleteRedTrash.svg"
import PinIcon from "@/images/icons/pinIcon.svg"

import {Thread} from "@/interfaces/TribeInterface";
import {useAppDispatch} from "@/redux/hook";
import {likeThread, removeTribeUser, setTribeUser, submitVote} from "@/features/tribes/tribe.slice";
import {useSelector} from "react-redux";
import {updateToastifyReducer} from "@/redux/toastifySlice";

interface ModalPosition {
    top: number;
    left: number;
}

interface ThreadCardProps {
    thread: Thread,
    tribe_id: number,
    toggle: () => void,
    onMoreIconClick: () => void;
    isModalVisible: boolean;
    modalPosition: ModalPosition | null;
    modalRef: any;
    moreIconRef: any
}



const ThreadCard: React.FC<ThreadCardProps> = ({thread, tribe_id, toggle, onMoreIconClick, isModalVisible, modalPosition, modalRef, moreIconRef}) => {
    const dispatch = useAppDispatch()
    const {authToken} = useSelector((state: any) => state.auth)
    const [isExpanded, setIsExpanded] = useState(false); // State to track if text is expanded
    const charLimit = 200; // Set your desired character limit

    const handleToggle = () => {
        setIsExpanded(!isExpanded); // Toggle the expanded state
    };

    const postLike = () => {
        dispatch(likeThread({id: thread?.id, tribe_id: tribe_id, token: authToken}))
    }

    const pollVote = (option_id: number) => {
        dispatch(submitVote({tribe_id, thread_id: thread.id, poll_id: thread.thread_polls.id, data: {option_id}, token: authToken})).then((res: any) => {
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
        }).catch(error => {
            dispatch(
                updateToastifyReducer({
                    show: true,
                    message: error.message || "Something went wrong. Please try again",
                    type: "error",
                })
            );
        })
    }

    console.log({isModalVisible, modalPosition})

    return (
        <div className="p-4 py-4 w-full h-full grid gap-[50px]">
            <div>
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <div>
                            <Image src={thread?.created_by?.user?.avatar} alt="" width={48} height={48}
                                   className="w-[48px] h-[48px] rounded-[16px] border-[1px] border-grey-90"/>
                        </div>
                        <div>
                            <p className="font-semi-normal font-sans text-[14px] leading-[14.4px]">{thread?.created_by?.user?.username}</p>
                        </div>
                        {
                            thread?.created_by.user.verified && (
                                <div>
                                    <Image src={"/images/verified.png"} alt="verifed" width={13} height={13}/>
                                </div>
                            )
                        }
                        <div>
                            <DotIcon className="w-[3px] h-[3px]"/>
                        </div>
                        <div>
                            <p className="font-sans font-normal text-[12px] leading-[14.4px]">{thread?.created_at}</p>
                        </div>
                    </div>
                    <div className="cursor-pointer" ref={moreIconRef}>
                        <MoreIcon className="cursor-pointer" onClick={onMoreIconClick} />
                    </div>
                </div>
                <div className="mt-[4px]">
                    <p className="font-sans font-semibold text-[14px] leading-[21px]">
                        {thread?.topic}
                    </p>
                    <p className="font-sans font-normal leading-[21px] text-[14px] text-light-black mt-[30px]">
                        {isExpanded || !thread?.thoughts || thread.thoughts.length <= charLimit
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
                {
                    thread?.media.length > 0 && (
                        <div>
                            <Image src={thread?.media[0]} alt="thread_image" width={736} height={540} objectFit="contain"
                                   className="w-[736px] h-[540px] rounded-[12px]" layout="responsive"/>
                        </div>
                    )
                }

                {
                    thread?.polls && thread?.thread_polls?.options.length > 0 && (
                        thread?.thread_polls?.options?.map((option, index) => (
                            <div className="grid gap-2 mt-[16px] bg-light_grey rounded-[12px] cursor-pointer" onClick={() => pollVote(option.id)} key={index}>
                                <div className="relative w-full h-[40px] bg-grey rounded-[8px] overflow-hidden">
                                    {/* Background bar showing the percentage */}
                                    <div
                                        className="absolute top-0 left-0 h-full bg-light-green-90 rounded-[8px]"
                                        style={{width: `${option.vote_percentage}%`}}
                                    ></div>
                                    {/* Content of the option */}
                                    <div className="relative z-10 flex justify-between items-center p-3">
                                        <div className="flex gap-2 items-center">
                                            {
                                                thread?.thread_polls.has_voted && (
                                                    thread.thread_polls.user_vote?.id === option.id ? (
                                                        <VotedIcon className="w-[20px] h-[20px]"/>
                                                    ) : (
                                                        <NotVoted className="w-[20px] h-[20px]"/>
                                                    )
                                                )
                                            }

                                            <p className="font-semi-normal text-[14px]">{option.content}</p>
                                        </div>
                                        <p className="font-semi-normal text-[14px]">{option.vote_percentage}%</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                }
                {
                    thread?.polls && (
                        <div className="mt-2">
                            <p className="text-text-grey text-[12px] font-semi-normal">
                                {`${thread?.thread_polls.total_votes} vote${thread?.thread_polls.total_votes === 1 ? '' : 's'}`}
                            </p>
                        </div>
                    )
                }

            </div>
            <div className="flex gap-4 mt-2">
                <div
                    className="rounded-[12px] bg-light_grey p-[4px] px-[8px] w-[64px] h-[30px] flex justify-center items-center cursor-pointer"
                    onClick={postLike}>
                    {
                        thread?.hasLiked ? (
                            <HeartFilledIcon/>
                        ) : (
                            <HeartIcon className=""/>
                        )
                    }
                </div>
                <div
                    className="rounded-[12px] bg-light_grey p-[4px] px-[8px] w-[64px] h-[30px] flex justify-center items-center">
                    <Image src={chat_image} alt="comment"/>
                </div>
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
                    <div className="p-[12px] px-[16px] flex gap-[8px] items-center cursor-pointer" >
                        <UserIcon className="w-[16.25px] h-[16.25px]"/>
                        <p className="font-normal text-[16px] text-black-light">View profile</p>
                    </div>
                    <div className="p-[12px] px-[16px] flex gap-[8px] items-center cursor-pointer">
                        <PinIcon className="w-[16.25px] h-[16.25px]"/>
                        <p className="font-normal text-[16px] text-black-light">Pin Thread</p>
                    </div>
                    <div className="p-[12px] px-[16px] flex gap-[8px] items-center cursor-pointer">
                        <FlagIcon className="w-[16.25px] h-[16.25px]"/>
                        <p className="font-normal text-[16px] text-black-light">Report Thread</p>
                    </div>
                    <div className="p-[12px] px-[16px] flex gap-[8px] items-center cursor-pointer">
                        <TrashRedIcon className="w-[16.25px] h-[16.25px]"/>
                        <p className="text-red-1 font-normal text-[16px]">Delete thread</p>
                    </div>
                </div>
            )}
            <div className="w-full border-b-[1px]"></div>
        </div>
    );
}

export default ThreadCard;