"use client";
import React, { useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import RequestIcon from "@/images/icons/requestIcon.svg";
import SettingsIcon from "@/images/icons/gear.svg";
import SearchIcon from "@/images/icons/search.svg";
import ChatListCard from "@/components/Jobs/ChatListCard";
import UserInfoModal from "@/components/connect/Modal/UserInfoModal";
import SettingsModal from "@/components/connect/Modal/SettingsModal";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ChatInterface } from "@/interfaces/ChatInterface";
import { useChatHistoryQuery, useChatQuery, useConnectionQuery } from "@/features/connect/queries";
import OpenedChat from "@/components/connect/OpenedChat";
import EmptyChat from "@/components/connect/EmptyChat";
import { usePusher } from "@/hooks/usePusher";
import MainLayout from "@/components/layouts/MainLayout";
import { useMediaQuery } from "react-responsive";
import { ChatListCardSkeleton } from "@/components/Skeletons";

const ConnectClient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(0);
  const [selectedReceiverId, setSelectedReceiverId] = useState<number | undefined>(undefined);
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  const [chatOpened, setChatOpened] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  usePusher(user?.id ? `chat.${user.id}` : null, "message.sent");

  const { data: chatHistory, isLoading: loadingChat } = useChatHistoryQuery({
    enabled: Boolean(user?.id),
  });
  const { data: connectionData } = useConnectionQuery({
    enabled: Boolean(user?.id),
  });
  const { data: openedChat } = useChatQuery(selectedReceiverId, {
    enabled: chatOpened,
  });
  const chats = chatHistory?.chats ?? [];
  const connection_info = connectionData;
  const chatData = openedChat?.chat ?? null;
  const messagesData = openedChat?.messages ?? [];

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const toggleSettingsModal = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleSelectedChat: (receiver_id: number, chat_id: number) => void = (
    receiver_id: number,
    chat_id: number,
  ) => {
    setSelectedReceiverId(receiver_id);
    setSelectedChatId(chat_id);
    setChatOpened(true);
  };

  const toggleChatOpened = () => {
    setChatOpened(!chatOpened);
    setSelectedChatId(0);
    setSelectedReceiverId(undefined);
  };
  return (
    <MainLayout>
      <section className="laptop:bg-light_grey bg-white pb-10">
        <div className="laptop:px-[64px] flex items-center justify-between border-t-[1px] border-b-[1px] bg-white p-[8px] px-[16px]">
          <div>
            <p className="text-[14px] font-semibold">Connect</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={"/connect/requests"}>
              <div className="border-light-grey-50 flex cursor-pointer items-center gap-2 rounded-[12px] border-[1px] p-[8px] px-[14px]">
                <RequestIcon />
                <p className="font-semi-normal text-black-light laptop:block hidden font-sans text-[16px]">
                  Requests
                </p>
              </div>
            </Link>
            <div
              className="border-light-grey-50 flex cursor-pointer items-center gap-2 rounded-[12px] border-[1px] p-[8px] px-[14px]"
              onClick={toggleSettingsModal}
            >
              <SettingsIcon />
              <p className="font-semi-normal text-black-light laptop:block hidden font-sans text-[16px]">
                Settings
              </p>
            </div>
          </div>
        </div>
        <section className="laptop:mt-4 mt-0 flex flex-col items-center">
          {isMobile && (
            <div className="flex flex-col">
              <div
                className={`${chatOpened ? "hidden" : "flex"} h-[648px] w-screen flex-col bg-white`}
              >
                <div className="p-[8px] px-[16px]">
                  <div className="bg-light_grey flex items-center gap-3 rounded-2xl px-4 py-3 shadow-sm ring-1 ring-black/5">
                    {/* Icon */}
                    <span className="shrink-0 text-gray-500">
                      <SearchIcon />
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
                      className="shrink-0 rounded-xl bg-white px-3 py-2 text-[13px] font-medium text-gray-700 ring-1 ring-black/5 transition hover:bg-gray-50 active:scale-[0.98]"
                    >
                      Search
                    </button>
                  </div>
                </div>
                <div className="hide-scrollbar max-h-screen overflow-y-auto">
                  {loadingChat ? (
                    <ChatListCardSkeleton count={6} />
                  ) : chats.length > 0 ? (
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
                    <div className={"mt-32 flex w-full flex-col items-center justify-center"}>
                      <p className={"font-ruso text-center"}>
                        Connect with someone new today to start chatting
                      </p>
                      <button
                        type={"button"}
                        className={
                          "bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong"
                        }
                      >
                        <p>Send request</p>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className={`${chatOpened ? "block" : "hidden"}`}>
                {chatOpened ? (
                  <OpenedChat
                    user_id={user?.id}
                    messages={messagesData}
                    toggleModal={toggleModal}
                    chat={chatData}
                    toggleOpenedChat={toggleChatOpened}
                  />
                ) : (
                  <EmptyChat />
                )}
              </div>
            </div>
          )}
          <div className="laptop:flex hidden">
            <div className="flex h-[648px] w-[375px] flex-col rounded-tl-[16px] rounded-bl-[16px] border-[1px] bg-white">
              <div className="p-[16px]">
                <p className="font-ruso text-black-light text-[18px] font-bold">Chats</p>
              </div>
              <div className="p-[8px] px-[16px]">
                <div className="bg-light_grey flex items-center gap-3 rounded-2xl px-4 py-3 shadow-sm ring-1 ring-black/5">
                  {/* Icon */}
                  <span className="shrink-0 text-gray-500">
                    <SearchIcon />
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
                    className="shrink-0 rounded-xl bg-white px-3 py-2 text-[13px] font-medium text-gray-700 ring-1 ring-black/5 transition hover:bg-gray-50 active:scale-[0.98]"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="hide-scrollbar max-h-screen overflow-y-auto">
                {loadingChat ? (
                  <ChatListCardSkeleton count={6} />
                ) : chats.length > 0 ? (
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
                    <div className={"mt-32 flex w-full flex-col items-center justify-center gap-4"}>
                      <p className={"font-ruso text-center"}>
                        Connect with someone new today to start chatting
                      </p>
                      <button
                        type={"button"}
                        className={
                          "bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong h-[48px] rounded-[12px] px-[12px]"
                        }
                      >
                        <p className={"font-ruso text-white"}>Send request</p>
                      </button>
                    </div>
                  </Link>
                )}
              </div>
            </div>
            {chatOpened ? (
              <OpenedChat
                user_id={user?.id}
                messages={messagesData}
                toggleModal={toggleModal}
                chat={chatData}
                toggleOpenedChat={toggleChatOpened}
              />
            ) : (
              <EmptyChat />
            )}
          </div>
        </section>

        <UserInfoModal userInfo={chatData} toggle={toggleModal} isOpen={isOpen} />
        <SettingsModal
          user_connect={connection_info}
          toggle={toggleSettingsModal}
          isOpen={isSettingsOpen}
        />
      </section>
    </MainLayout>
  );
};

export default ConnectClient;
