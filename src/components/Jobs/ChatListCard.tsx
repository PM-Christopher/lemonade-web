import React from 'react';
import Image from "next/image";
import avatar from "@/image/avatar_3.png";
import DotIcon from "@/image/icons/Dot.svg";
import {ChatInterface} from "@/interfaces/ChatInterface";

type ChatListInterface = {
    active: boolean,
    chat: ChatInterface,
    toggleChat: (receiver_id: number, chat_id: number) => void,
    user_id: number
}

const ChatListCard: React.FC<ChatListInterface> = ({ active, chat, toggleChat, user_id }) => {
    const receiver_id = user_id === chat.sender.id ? chat.receiver.id : chat.sender.id
    const userType = chat.isReceiver ? chat.sender : chat.receiver
    return (
        <div className={`p-[16px] flex items-center gap-[8px] ${active && "bg-light-green-10"} cursor-pointer`} onClick={() => toggleChat(receiver_id, chat.id)}>
            <div>
                <div
                    className={`w-[48px] h-[48px] bg-cover bg-center rounded-[16px]`}
                    style={{background: `url(${userType.avatar})`, backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat"}}
                ></div>
            </div>
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-[4px]">
                    <p className="font-semibold text-[14px] text-black-light">{userType.username}</p>
                    <DotIcon className="w-[4px]"/>
                    <p className="text-text-grey text-[14px] font-normal">L{userType.lemon_id}</p>
                </div>
                <div className="flex justify-between">
                    <p className="font-normal text-[14px] text-light-black">{chat?.latest_message.message}</p>
                    <div className="flex gap-2">
                        <p className="text-[12px] font-normal text-text-grey">|</p>
                        <p className="text-[12px] font-normal text-text-grey">{chat?.latest_message.created_at}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatListCard;