"use client"
import React, {useEffect, useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import RequestIcon from "@/images/icons/requestIcon.svg";
import SettingsIcon from "@/images/icons/gear.svg"
import SearchIcon from "@/images/icons/search.svg";
import ChatListCard from "@/components/Jobs/ChatListCard";
import UserInfoModal from "@/components/connect/Modal/UserInfoModal";
import SettingsModal from "@/components/connect/Modal/SettingsModal";
import Link from "next/link";
import {useRequest} from "@/hooks/useRequest";
import {useSelector} from "react-redux";
import {ChatInterface, MessageInterface} from "@/interfaces/ChatInterface";
import {getChat, getConnection, getMessages, removeChat} from "@/features/connect/connect.slice";
import OpenedChat from "@/components/connect/OpenedChat";
import EmptyChat from "@/components/connect/EmptyChat";
import Pusher from "pusher-js";
import {usePusher} from "@/hooks/usePusher";
import {useAppDispatch} from "@/redux/hook";
import MainLayout from "@/components/layouts/MainLayout";
import {useMediaQuery} from "react-responsive";
import {RootState} from "@/redux/store";
import {ChatListCardSkeleton} from "@/components/Skeletons";

const ConnectPage = () => {
    const dispatch = useAppDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [selectedChatId, setSelectedChatId] = useState(0)
    const [messages, setMessages] = useState<MessageInterface[]>([])
    const isMobile = useMediaQuery({query: "(max-width: 1023px)"});
    const [chatOpened, setChatOpened] = useState(false)
    const {authToken, user} = useSelector((state: any) => state.auth)
    usePusher(`chat.${user?.id}`, "message.sent");

    const {
        messages: messagesData,
        chat: chatData,
        loading,
        chats,
        connection_info
    } = useSelector((state: RootState) => state.chat)

    useEffect(() => {
        dispatch(getMessages())
        dispatch(getConnection())
    }, [dispatch]);

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const toggleSettingsModal = () => {
        setIsSettingsOpen(!isSettingsOpen)
    }

    const toggleSelectedChat: (receiver_id: number, chat_id: number) => void = (receiver_id: number, chat_id: number) => {
        dispatch(getChat({receiver_id, token: authToken}))
        setSelectedChatId(chat_id);
        setChatOpened(true)
    };

    const toggleChatOpened = () => {
        setChatOpened(!chatOpened)
        setSelectedChatId(0)
        dispatch(removeChat())
    }

    const loadingChat = false
    return (
        <MainLayout>
            <section className="bg-white laptop:bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[8px] px-[16px] laptop:px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div>
                        <p className="font-semibold text-[14px]">Connect</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Link href={"/connect/requests"}>
                            <div
                                className="border-[1px] p-[8px] px-[14px] gap-2 flex items-center border-light-grey-50 rounded-[12px] cursor-pointer"
                            >
                                <RequestIcon/>
                                <p className="font-sans font-semi-normal text-[16px] text-black-light hidden laptop:block">Requests</p>
                            </div>
                        </Link>
                        <div
                            className="border-[1px] p-[8px] px-[14px] gap-2 flex items-center border-light-grey-50 rounded-[12px] cursor-pointer"
                            onClick={toggleSettingsModal}
                        >
                            <SettingsIcon/>
                            <p className="font-sans font-semi-normal text-[16px] text-black-light hidden laptop:block">Settings</p>
                        </div>
                    </div>
                </div>
                <section className="mt-0 laptop:mt-4 flex flex-col items-center">
                    {
                        isMobile && (
                            <div className="flex flex-col">
                                <div className={`${chatOpened ? "hidden" : "flex"} flex-col w-screen h-[648px] bg-white`}>
                                    <div className="p-[8px] px-[16px]">
                                        <div
                                            className="flex items-center gap-3 rounded-2xl bg-light_grey px-4 py-3 shadow-sm ring-1 ring-black/5">
                                            {/* Icon */}
                                            <span className="shrink-0 text-gray-500">
                                                <SearchIcon/>
                                            </span>

                                            {/* Input */}
                                            <input
                                                id="search"
                                                type="text"
                                                className="w-full bg-transparent text-[14px] outline-none placeholder:text-gray-400"
                                                placeholder="Search user, chat..."
                                            />

                                            {/* Optional quick action */}
                                            <button
                                                type="button"
                                                className="shrink-0 rounded-xl bg-white px-3 py-2 text-[13px] font-medium text-gray-700 ring-1 ring-black/5 hover:bg-gray-50 active:scale-[0.98] transition"
                                            >
                                                Search
                                            </button>
                                        </div>

                                    </div>
                                    <div className="overflow-y-auto max-h-screen hide-scrollbar">
                                        {
                                            loadingChat ? (
                                                <ChatListCardSkeleton count={6}/>
                                            ) : (
                                                chats.length > 0 ? (
                                                    chats?.map((chat: ChatInterface, index: number) => (
                                                        <ChatListCard
                                                            user_id={user?.id}
                                                            chat={chat}
                                                            active={chat?.id === selectedChatId}
                                                            toggleChat={toggleSelectedChat}
                                                            key={index}
                                                        />
                                                    ))
                                                ) : (
                                                    <div className={"flex flex-col items-center justify-center mt-32 w-full"}>
                                                        <p className={"font-ruso text-center"}>Connect with someone new today to start chatting</p>
                                                        <button type={"button"} className={"bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong"}>
                                                            <p>Send request</p>
                                                        </button>
                                                    </div>
                                                )
                                            )
                                        }
                                    </div>
                                </div>
                                <div className={`${chatOpened ? "block" : "hidden"}`}>
                                    {
                                        chatOpened ? (
                                            <OpenedChat
                                                user_id={user?.id}
                                                messages={messagesData}
                                                toggleModal={toggleModal}
                                                chat={chatData}
                                                toggleOpenedChat={toggleChatOpened}
                                            />
                                        ) : (
                                            <EmptyChat/>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                    <div className="hidden laptop:flex">
                        <div
                            className="w-[375px] h-[648px] border-[1px] bg-white flex flex-col rounded-tl-[16px] rounded-bl-[16px]">
                            <div className="p-[16px]">
                                <p className="font-bold text-[18px] text-black-light">Chats</p>
                            </div>
                            <div className="p-[8px] px-[16px]">
                                <div
                                    className="flex items-center gap-3 rounded-2xl bg-light_grey px-4 py-3 shadow-sm ring-1 ring-black/5">
                                    {/* Icon */}
                                    <span className="shrink-0 text-gray-500">
                                        <SearchIcon/>
                                    </span>

                                    {/* Input */}
                                    <input
                                        id="search"
                                        type="text"
                                        className="w-full bg-transparent text-[14px] outline-none placeholder:text-gray-400"
                                        placeholder="Search user, chat..."
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") return;
                                        }}
                                    />

                                    {/* Optional quick action */}
                                    <button
                                        type="button"
                                        className="shrink-0 rounded-xl bg-white px-3 py-2 text-[13px] font-medium text-gray-700 ring-1 ring-black/5 hover:bg-gray-50 active:scale-[0.98] transition"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-screen hide-scrollbar">
                                {
                                    loadingChat ? (
                                        <ChatListCardSkeleton count={6}/>
                                    ) : (
                                        chats.length > 0 ? (
                                            chats?.map((chat: ChatInterface, index: number) => (
                                                <ChatListCard
                                                    user_id={user?.id}
                                                    chat={chat}
                                                    active={chat?.id === selectedChatId}
                                                    toggleChat={toggleSelectedChat}
                                                    key={index}
                                                />
                                            ))
                                        ) : (
                                            <Link href={"/connect/requests"}>
                                                <div className={"flex flex-col items-center justify-center mt-32 w-full gap-4"}>
                                                    <p className={"font-ruso text-center"}>Connect with someone new today to start chatting</p>
                                                    <button type={"button"} className={"bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong h-[48px] px-[12px] rounded-[12px]"}>
                                                        <p className={"font-ruso text-white"}>Send request</p>
                                                    </button>
                                                </div>
                                            </Link>
                                        )
                                    )
                                }
                            </div>
                        </div>
                        {
                            chatOpened ? (
                                <OpenedChat
                                    user_id={user?.id}
                                    messages={messagesData}
                                    toggleModal={toggleModal}
                                    chat={chatData}
                                    toggleOpenedChat={toggleChatOpened}
                                />
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