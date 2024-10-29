"use client"
import React, {useEffect, useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import RequestIcon from "@/images/icons/requestIcon.svg";
import SettingsIcon from "@/images/icons/gear.svg"
import SearchIcon from "@/images/icons/search.svg";
import ChatListCard from "@/components/Jobs/ChatListCard";
import UserInfoModal from "@/components/Connect/Modal/UserInfoModal";
import SettingsModal from "@/components/Connect/Modal/SettingsModal";
import Link from "next/link";
import {useRequest} from "@/hooks/useRequest";
import {useSelector} from "react-redux";
import {ChatInterface, MessageInterface} from "@/interfaces/ChatInterface";
import {getChat} from "@/features/connect/connect.slice";
import OpenedChat from "@/components/Connect/OpenedChat";
import EmptyChat from "@/components/Connect/EmptyChat";
import Pusher from "pusher-js";
import {usePusher} from "@/hooks/usePusher";
import {useAppDispatch} from "@/redux/hook";
import MainLayout from "@/components/layouts/MainLayout";

const ConnectPage = () => {
    const dispatch = useAppDispatch()
    const [isOpen,setIsOpen] = useState(false)
    const [isSettingsOpen,setIsSettingsOpen] = useState(false)
    const [selectedChatId, setSelectedChatId] = useState(0)
    const [messages, setMessages] = useState<MessageInterface[]>([])

    const {authToken, user} = useSelector((state: any) => state.auth)

    const {messages: messagesData, chat: chatData, loading} = useSelector((state: any) => state.chat)

    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const { data } = useRequest("/messages", "GET", {}, true, getHeader())

    const { data: connection_info, loading: connect_loading } = useRequest("/connect", "GET", {}, true, getHeader())

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const toggleSettingsModal = () => {
        setIsSettingsOpen(!isSettingsOpen)
    }

    const toggleSelectedChat: (receiver_id: number, chat_id: number) => void = (receiver_id: number, chat_id: number) => {
        setSelectedChatId(chat_id);
        dispatch(getChat({receiver_id, token: authToken}))
    };

    usePusher("chat-channel", "message-sent");
    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <TopNav/>
                <div
                    className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div>
                        <p className="font-semibold text-[14px]">Connect</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Link href={"/connect/requests"}>
                            <div
                                className="border-[1px] p-[8px] px-[14px] gap-2 flex items-center border-light-grey-50 rounded-[12px] cursor-pointer"
                            >
                                <RequestIcon/>
                                <p className="font-sans font-semi-normal text-[16px] text-black-light">Requests</p>
                            </div>
                        </Link>
                        <div
                            className="border-[1px] p-[8px] px-[14px] gap-2 flex items-center border-light-grey-50 rounded-[12px] cursor-pointer"
                            onClick={toggleSettingsModal}
                        >
                            <SettingsIcon/>
                            <p className="font-sans font-semi-normal text-[16px] text-black-light">Settings</p>
                        </div>
                    </div>
                </div>
                <section className="min-h-screen mt-4 flex flex-col items-center">
                    <div className="flex">
                        <div
                            className="w-[375px] h-[648px] border-[1px] bg-white flex flex-col rounded-tl-[16px] rounded-bl-[16px]">
                            <div className="p-[16px]">
                                <p className="font-bold text-[18px] text-black-light">Chats</p>
                            </div>
                            <div className="p-[8px] px-[16px]">
                                <div
                                    className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px]">
                                    <div>
                                        <SearchIcon/>
                                    </div>
                                    <div>
                                        <input
                                            id="search"
                                            type="text"
                                            className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                                            placeholder="Search user, chat..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-screen hide-scrollbar">
                                {
                                    data?.chats?.map((chat: ChatInterface, index: number) => (
                                        <ChatListCard user_id={user?.id} chat={chat} active={true}
                                                      toggleChat={toggleSelectedChat} key={index}/>
                                    ))
                                }
                            </div>
                        </div>
                        {
                            messagesData.length > 0 ? (
                                selectedChatId === chatData.id && (
                                    <OpenedChat user_id={user?.id} messages={messagesData} toggleModal={toggleModal}
                                                chat={chatData}/>
                                )
                            ) : (
                                <EmptyChat/>
                            )
                        }
                    </div>
                </section>
                <UserInfoModal userInfo={chatData} toggle={toggleModal} isOpen={isOpen}/>
                <SettingsModal user_connect={connection_info} toggle={toggleSettingsModal} isOpen={isSettingsOpen}/>
            </section>
        </MainLayout>
    );
}

export default ConnectPage;