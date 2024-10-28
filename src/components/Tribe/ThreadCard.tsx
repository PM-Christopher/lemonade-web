import React from 'react';
import Image from "next/image";
import ver_image from "@/image/verified.png";
import DotIcon from "@/image/icons/Dot.svg";
import MoreIcon from "@/image/icons/MoreIcon.svg";
import heart_image from "@/image/icons/heart.png";
import chat_image from "@/image/icons/chat.png";
import HeartIcon from "@/image/icons/HeartIcon.svg"
import HeartFilledIcon from "@/image/icons/HeartFilledIcon.svg"

import {TribeThreadInterface} from "@/interfaces/TribeInterface";
import {useAppDispatch} from "@/redux/hook";
import {likeThread} from "@/features/tribes/tribe.slice";
import {useSelector} from "react-redux";

interface ThreadCardProps {
    thread: TribeThreadInterface,
    tribe_id: number
}

const ThreadCard: React.FC<ThreadCardProps> = ({thread, tribe_id}) => {
    const dispatch = useAppDispatch()
    const {authToken} = useSelector((state: any) => state.auth)

    const postLike = () => {
        dispatch(likeThread({id: thread?.id, tribe_id: tribe_id, token: authToken}))
    }

    return (
        <div className="bg-white p-4 py-4">
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <div>
                        <Image src={thread?.user?.avatar} alt="" width={48} height={48} objectFit="fill" />
                    </div>
                    <div>
                        <p className="font-semi-normal font-sans text-[14px] leading-[14.4px]">{thread?.user?.username}</p>
                    </div>
                    <div>
                        <Image src={ver_image} alt="verifed"/>
                    </div>
                    <div>
                        <DotIcon className="w-[3px] h-[3px]"/>
                    </div>
                    <div>
                        <p className="font-sans font-normal text-[12px] leading-[14.4px]">{thread?.created_at}</p>
                    </div>
                </div>
                <div>
                    <MoreIcon/>
                </div>
            </div>
            <div>
                <p className="font-sans font-semibold text-[14px] leading-[21px]">
                    {thread?.topic}
                </p>
                <p className="font-sans font-normal leading-[21px] text-[14px] text-light-black">
                    {thread?.thoughts}
                </p>
                <p className="font-sans font-semi-normal text-[14px] text-light-green">see more</p>
            </div>
            {
                thread?.media.length > 0 && (
                    <div>
                        <Image src={thread?.media[0]} alt="thread_image" width={736} height={540} objectFit="contain" className="w-[736px] h-[540px] rounded-[12px]" layout="responsive"/>
                    </div>
                )
            }
            <div className="flex gap-4 mt-2">
                <div className="rounded-[12px] bg-light_grey p-[4px] px-[8px] w-[64px] h-[30px] flex justify-center items-center cursor-pointer" onClick={postLike}>
                    {
                        thread?.hasLiked ? (
                            <HeartFilledIcon />
                        ) : (
                            <HeartIcon className="" />
                        )
                    }
                </div>
                <div
                    className="rounded-[12px] bg-light_grey p-[4px] px-[8px] w-[64px] h-[30px] flex justify-center items-center">
                    <Image src={chat_image} alt="comment"/>
                </div>
            </div>
        </div>
    );
}

export default ThreadCard;