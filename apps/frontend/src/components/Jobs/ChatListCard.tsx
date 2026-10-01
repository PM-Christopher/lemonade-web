import React from "react";
import DotIcon from "@/images/icons/dot.svg";
import { ChatInterface } from "@/interfaces/ChatInterface";
import { formatTimeAgo } from "@/lib/helper";

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
    // <div className={`p-4 flex items-center gap-2 ${active && "bg-light-green-10"} cursor-pointer`}>
    <div
      className={`flex items-center gap-3 rounded-xl p-4 transition-all duration-150 ${
        active ? "bg-light-green-10" : "hover:bg-gray-50"
      } cursor-pointer`}
      onClick={() => toggleChat(receiver_id, chat.id)}
    >
      {/* Avatar / Initials */}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-semibold text-white shadow-sm ${
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
      <div className="border-grey-20 flex w-full flex-col border-b pb-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-black-light truncate text-[14px] font-semibold">
              {userType.username}
            </p>
            <DotIcon className="h-[5px] w-2.5 text-gray-400" />
            <p className="text-text-grey text-[13px] font-normal">L{userType.lemon_id}</p>
          </div>

          {/* Timestamp */}
          {chat?.latest?.created_at ? (
            <p className="text-text-grey text-[12px] font-normal whitespace-nowrap">
              {formatTimeAgo(chat.latest.created_at)}
            </p>
          ) : (
            <p className="text-[12px] font-normal whitespace-nowrap text-gray-400 italic">—</p>
          )}
        </div>

        {/* Message Preview */}
        <div className="mt-1 flex items-center justify-between">
          {chat?.latest && (chat.latest.message || chat.latest.type) ? (
            chat.latest.type === "text" ? (
              <p className="text-light-black truncate text-[14px] font-normal">
                {chat.latest.message}
              </p>
            ) : (
              <div className="text-light-black flex items-center gap-1 text-[13px]">
                <p className="font-normal">📎 File</p>
              </div>
            )
          ) : (
            <p className="text-[14px] font-normal text-gray-400 italic">No recent message</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListCard;
