"use client";
import React, { useState } from "react";
import RequestIcon from "@/images/icons/requestIcon.svg";
import SettingsIcon from "@/images/icons/gear.svg";
import ChatListCard from "@/components/Jobs/ChatListCard";
import UserInfoModal from "@/components/connect/Modal/UserInfoModal";
import SettingsModal from "@/components/connect/Modal/SettingsModal";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { ChatInterface } from "@/interfaces/ChatInterface";
import {
  useChatHistoryQuery,
  useChatQuery,
  useConnectionQuery,
  useInvitesQuery,
} from "@/features/connect/queries";
import UserSearch from "@/components/connect/UserSearch";
import type { FoundUser } from "@/features/connect/api";
import OpenedChat from "@/components/connect/OpenedChat";
import EmptyChat from "@/components/connect/EmptyChat";
import { usePusher } from "@/hooks/usePusher";
import { useAuthReady } from "@/hooks/useAuthReady";
import { useIsMobile } from "@/hooks/useIsMobile";
import MainLayout from "@/components/layouts/MainLayout";
import { ChatListCardSkeleton } from "@/components/Skeletons";
import type { RootState } from "@/redux/store";
import { routes } from "@/lib/routes";

// Loaded only once a searched user is picked.
const ConnectModal = dynamic(() => import("@/components/connect/Modal/ConnectModal"), {
  ssr: false,
});

const ConnectClient = () => {
  const [connectTarget, setConnectTarget] = useState<FoundUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | undefined>(undefined);
  const isMobile = useIsMobile(1024);
  const [chatOpened, setChatOpened] = useState(false);
  const authReady = useAuthReady();
  const { user } = useSelector((state: RootState) => state.auth);
  usePusher(authReady && user?.id ? `chat.${user.id}` : null, "message.sent");

  const { data: chatHistory, isLoading: loadingChat } = useChatHistoryQuery({
    enabled: Boolean(user?.id),
  });
  const { data: connectionData } = useConnectionQuery({
    enabled: Boolean(user?.id),
  });
  const { data: invitesData } = useInvitesQuery({ enabled: Boolean(user?.id) });
  const pendingCount = invitesData?.invites.length ?? 0;
  const { data: openedChat } = useChatQuery(selectedReceiverId, {
    enabled: chatOpened,
  });
  const chats = chatHistory?.chats ?? [];
  const connection_info = connectionData;
  const chatData = openedChat?.chat ?? null;
  const messagesData = openedChat?.messages ?? [];
  // The other person in the open chat, whichever side started it.
  const otherUser = chatData
    ? chatData.sender.id === user?.id
      ? chatData.receiver
      : chatData.sender
    : null;

  const openConnectModal = (user: FoundUser) => setConnectTarget(user);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const toggleSettingsModal = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleSelectedChat: (receiver_id: string, chat_id: string) => void = (
    receiver_id: string,
    chat_id: string,
  ) => {
    setSelectedReceiverId(receiver_id);
    setSelectedChatId(chat_id);
    setChatOpened(true);
  };

  const toggleChatOpened = () => {
    setChatOpened(!chatOpened);
    setSelectedChatId(null);
    setSelectedReceiverId(undefined);
  };
  return (
    <MainLayout>
      <section className="laptop:bg-light_grey bg-white pb-10">
        <div className="laptop:px-16 flex items-center justify-between border-t border-b bg-white p-2 px-4">
          <div>
            <p className="text-body-s font-semibold">Connect</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={routes.CONNECT_REQUESTS}>
              <div className="border-light-grey-50 flex cursor-pointer items-center gap-2 rounded-xl border p-2 px-3.5">
                <RequestIcon />
                <p className="font-semi-normal text-black-light laptop:block text-body-l hidden font-sans">
                  Requests
                </p>
                {pendingCount > 0 && (
                  <span
                    className="text-meta flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 leading-none font-semibold text-white"
                    aria-label={`${pendingCount} pending requests`}
                  >
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </span>
                )}
              </div>
            </Link>
            <div
              className="border-light-grey-50 flex cursor-pointer items-center gap-2 rounded-xl border p-2 px-3.5"
              onClick={toggleSettingsModal}
            >
              <SettingsIcon />
              <p className="font-semi-normal text-black-light laptop:block text-body-l hidden font-sans">
                Settings
              </p>
            </div>
          </div>
        </div>
        <section className="laptop:mt-4 mt-0 flex flex-col items-center">
          {isMobile && (
            <div className="flex flex-col">
              <div className={`${chatOpened ? "hidden" : "flex"} h-162 w-screen flex-col bg-white`}>
                <div className="p-2 px-4">
                  <UserSearch onSelect={openConnectModal} />
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
                      <button type={"button"} className={"bg-gradient-green"}>
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
                    blocked={openedChat?.blocked}
                  />
                ) : (
                  <EmptyChat />
                )}
              </div>
            </div>
          )}
          <div className="laptop:flex hidden">
            <div className="flex h-162 w-93.75 flex-col rounded-tl-2xl rounded-bl-2xl bg-white">
              <div className="p-4">
                <p className="font-ruso text-black-light text-body-xl font-bold">Chats</p>
              </div>
              <div className="p-2 px-4">
                <UserSearch onSelect={openConnectModal} />
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
                  <Link href={routes.CONNECT_REQUESTS}>
                    <div className={"mt-32 flex w-full flex-col items-center justify-center gap-4"}>
                      <p className={"font-ruso text-center"}>
                        Connect with someone new today to start chatting
                      </p>
                      <button type={"button"} className={"bg-gradient-green h-12 rounded-xl px-3"}>
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
                blocked={openedChat?.blocked}
              />
            ) : (
              <EmptyChat />
            )}
          </div>
        </section>

        {connectTarget && (
          <ConnectModal
            users={[connectTarget]}
            isOpen
            toggle={() => setConnectTarget(null)}
            key={connectTarget.id}
          />
        )}
        <UserInfoModal
          userInfo={otherUser ? { receiver: otherUser } : null}
          toggle={toggleModal}
          isOpen={isOpen}
        />
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
