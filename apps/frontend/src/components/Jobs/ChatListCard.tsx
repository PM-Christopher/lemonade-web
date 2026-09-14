import React from "react";
import DotIcon from "@/images/icons/dot.svg";
import { ChatInterface } from "@/interfaces/ChatInterface";
import { formatTimeAgo } from "@/lib/helper";
import Image from "next/image";

type ChatListInterface = {
  active: boolean;
  chat: ChatInterface;
  toggleChat: (receiver_id: number, chat_id: number) => void;
  user_id: number;
};

const ChatListCard: React.FC<ChatListInterface> = ({ active, chat, toggleChat, user_id }) => {
  const receiver_id = user_id === chat.sender.id ? chat.receiver.id : chat.sender.id;
  const userType = chat?.sender?.id !== user_id ? chat?.sender : chat?.receiver;

  return (
    // <div className={`p-[16px] flex items-center gap-[8px] ${active && "bg-light-green-10"} cursor-pointer`}>
    <div
      className={`flex items-center gap-3 rounded-xl p-4 transition-all duration-150 ${
        active ? "bg-light-green-10" : "hover:bg-gray-50"
      } cursor-pointer`}
      onClick={() => toggleChat(receiver_id, chat.id)}
    >
      {/* Avatar / Initials */}
      <div
        className={`flex h-[48px] w-[48px] items-center justify-center rounded-[16px] text-lg font-semibold text-white shadow-sm ${
          userType?.avatar ? "" : "bg-gray-500"
        }`}
        style={
          userType?.avatar
            ? {
                backgroundImage: `url(${userType.avatar})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
      >
        {!userType?.avatar && (
          <>
            {userType?.username
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </>
        )}
      </div>

      {/* Chat Info */}
      <div className="flex w-full flex-col border-b border-grey-20 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="truncate text-[14px] font-semibold text-black-light">
              {userType.username}
            </p>
            <DotIcon className="h-[5px] w-[10px] text-gray-400" />
            <p className="text-[13px] font-normal text-text-grey">L{userType.lemon_id}</p>
          </div>

          {/* Timestamp */}
          {chat?.latest?.created_at ? (
            <p className="whitespace-nowrap text-[12px] font-normal text-text-grey">
              {formatTimeAgo(chat.latest.created_at)}
            </p>
          ) : (
            <p className="whitespace-nowrap text-[12px] font-normal italic text-gray-400">—</p>
          )}
        </div>

        {/* Message Preview */}
        <div className="mt-1 flex items-center justify-between">
          {chat?.latest && (chat.latest.message || chat.latest.type) ? (
            chat.latest.type === "text" ? (
              <p className="truncate text-[14px] font-normal text-light-black">
                {chat.latest.message}
              </p>
            ) : (
              <div className="flex items-center gap-1 text-[13px] text-light-black">
                <p className="font-normal">📎 File</p>
              </div>
            )
          ) : (
            <p className="text-[14px] font-normal italic text-gray-400">No recent message</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListCard;
