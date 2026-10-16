import React from "react";
import DotIcon from "@/images/icons/dot.svg";
import { ChatInterface } from "@/interfaces/ChatInterface";
import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import { formatTimeAgo, getInitials } from "@/lib/helper";

type ChatListInterface = {
  active: boolean;
  chat: ChatInterface;
  toggleChat: (receiver_id: string, chat_id: string) => void;
  user_id: string | undefined;
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
        className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-lg font-semibold text-white shadow-sm ${
          userType?.avatar ? "" : "bg-gray-500"
        }`}
      >
        {userType?.avatar ? (
          <FallbackImage
            src={userType.avatar}
            fallbackSrc={images.AVATAR_4}
            alt={userType.username ?? "avatar"}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        ) : (
          getInitials(userType?.username).slice(0, 2)
        )}
      </div>

      {/* Chat Info */}
      <div className="flex min-w-0 flex-1 flex-col pb-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-black-light text-body-s truncate font-semibold">
              {userType.username}
            </p>
            <DotIcon className="h-1.25 w-2.5 text-gray-400" />
            <p className="text-text-grey text-meta leading-normal font-normal">
              L{userType.lemon_id}
            </p>
          </div>

          {/* Timestamp */}
          {chat?.latest?.created_at ? (
            <p className="text-text-grey text-meta leading-normal font-normal whitespace-nowrap">
              {formatTimeAgo(chat.latest.created_at)}
            </p>
          ) : (
            <p className="text-meta leading-normal font-normal whitespace-nowrap text-gray-400 italic">
              —
            </p>
          )}
        </div>

        {/* Message Preview */}
        <div className="mt-1 flex items-center justify-between">
          {chat?.latest && (chat.latest.message || chat.latest.type) ? (
            chat.latest.type === "text" ? (
              <p className="text-light-black text-body-s truncate font-normal">
                {chat.latest.message}
              </p>
            ) : (
              <div className="text-light-black text-meta flex items-center gap-1 leading-normal">
                <p className="font-normal">📎 File</p>
              </div>
            )
          ) : (
            <p className="text-body-s font-normal text-gray-400 italic">No recent message</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListCard;
