import React from 'react';
import DotIcon from "@/images/icons/dot.svg";
import {ChatInterface} from "@/interfaces/ChatInterface";
import {formatTimeAgo} from "@/lib/helper";
import Image from "next/image";

type ChatListInterface = {
    active: boolean,
    chat: ChatInterface,
    toggleChat: (receiver_id: number, chat_id: number) => void,
    user_id: number
}

const ChatListCard: React.FC<ChatListInterface> = ({ active, chat, toggleChat, user_id }) => {
    const receiver_id = user_id === chat.sender.id ? chat.receiver.id : chat.sender.id
    const userType = chat?.sender?.id !== user_id ? chat?.sender : chat?.receiver

    return (
        // <div className={`p-[16px] flex items-center gap-[8px] ${active && "bg-light-green-10"} cursor-pointer`}>
        <div className={`p-[16px] flex items-center gap-[8px] ${active && "bg-light-green-10"} cursor-pointer`} onClick={() => toggleChat(receiver_id, chat.id)}>
            <div>
                <div
                    className={`w-[48px] h-[48px] bg-cover bg-center rounded-[16px]`}
                    style={{background: `url(${userType.avatar})`, backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat"}}
                ></div>
            </div>
            <div className="flex flex-col w-full border-b-[1px] py-[12px] border-b-grey-20">
                <div className="flex items-center gap-[4px]">
                    <p className="font-semibold text-[14px] text-black-light">{userType.username}</p>
                    <DotIcon className="w-[4px]"/>
                    <p className="text-text-grey text-[14px] font-normal">L{userType.lemon_id}</p>
                </div>
                <div className="flex justify-between">
                    {
                        chat?.latest.type === 'text' ? (
                            <p className="font-normal text-[14px] text-light-black">{chat?.latest.message}</p>
                        ) : (
                            <div className={'flex flex-wrap items-center gap-[4px]'}>
                                <Image src={chat?.latest?.message} alt={'message'} width={16} height={16} className={'w-[16px] h-[16px] rounded'} />
                                <p className="font-normal text-[12px] text-light-black"> - File</p>
                            </div>
                        )
                    }
                    <div className="flex gap-2">
                        <p className="text-[12px] font-normal text-text-grey">|</p>
                        <p className="text-[12px] font-normal text-text-grey">{formatTimeAgo(chat?.latest.created_at)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatListCard;