"use client"
import React, {useEffect, useRef, useState} from 'react';
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import MoreIcon from "@/images/icons/moreIcon.svg";
import ImageIcon from "@/images/icons/imageIcon.svg";
import {ChatInterface, MessageInterface} from "@/interfaces/ChatInterface";
import SendIcon from "@/images/icons/sendIcon.svg";
import {useAppDispatch} from "@/redux/hook";
import {sendChat} from "@/features/connect/connect.slice";
import {useSelector} from "react-redux";
import {splitLemonId} from "@/lib/helper";

type OpenChatProps = {
    toggleModal: () => void,
    messages: MessageInterface[],
    chat: ChatInterface,
    user_id: number
}

const OpenedChat: React.FC<OpenChatProps> = ({toggleModal, chat, messages, user_id}) => {
    const dispatch = useAppDispatch()
    const [text, setText] = useState<string|null>(null)
    const { authToken: token } = useSelector((state: any) => state.auth)

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll to bottom when messages are updated
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        const receiver_id = user_id === chat.sender.id ? chat.receiver.id : chat.sender.id
        dispatch(sendChat({receiver_id, token, message: text}))
        setText(null)
    }

    return (
        <div
            className="w-[560px] h-[648px] border-t-[1px] border-b-[1px] border-r-[1px] bg-white flex flex-col rounded-tr-[16px] rounded-br-[16px] relative">

            <div
                className="absolute top-0 left-0 w-full bg-grey-20 text-white p-[8px] rounded-tr-[16px]">
                <div className="px-[16px] flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <Image src={chat.receiver.avatar} alt="avatar" width={24} height={24} className="w-[24px] h-[24px] rounded-[8px] border-[1px] border-grey-90"/>
                        <p className="font-semibold text-[14px] text-black-light">{chat.receiver.username}</p>
                        <DotIcon className="w-[4px]"/>
                        <p className="text-text-grey text-[14px] font-semibold">L{chat.receiver.lemon_id}</p>
                    </div>
                    <MoreIcon className="cursor-pointer" onClick={toggleModal}/>
                </div>
            </div>

            <div
                className="flex-grow flex flex-col-reverse overflow-y-auto justify-start items-center bg-white rounded-tr-[16px] rounded-br-[16px] p-[16px] mt-8 mb-16">
                <div
                    className="flex flex-col w-full gap-[12px] overflow-y-auto max-h-screen hide-scrollbar">
                    {
                        messages.map((message: MessageInterface, index: number) => (
                            <div
                                className={`text-right p-[8px] max-w-[303px] ml-auto rounded-[12px] ${message.sender ? "bg-light-green-10" : "bg-grey-20"}`}
                                key={index}
                            >
                                <p className="font-normal text-[14px]">{message.message}</p>
                                <p className="text-[12px] text-right text-text-grey">{message.created_at}</p>
                            </div>
                        ))
                    }
                    <div ref={messagesEndRef}/>
                </div>
            </div>

            <div
                className="absolute bottom-0 left-0 w-full bg-light_grey text-white p-[16px] px-[13px] rounded-br-[16px]">
                <div className="flex gap-[8px] items-center">
                    <div className="flex items-center justify-between gap-3 bg-light_grey p-2 px-[12px] rounded-full w-full border-[1px]">
                        <div className="w-full">
                            <input
                                id="search"
                                type="text"
                                className="rounded-xl w-full text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent text-black-light"
                                placeholder="Reply..."
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>
                        {
                            text && (
                                <div>
                                    <SendIcon className="w-[19.72px] h-[19.25px] cursor-pointer" onClick={sendMessage}/>
                                </div>
                            )
                        }
                    </div>
                    <ImageIcon className="w-[19.5px] cursor-pointer"/>
                </div>
            </div>
        </div>
    );
}

export default OpenedChat;