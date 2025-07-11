"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import MoreIcon from "@/images/icons/moreIcon.svg";
import ImageIcon from "@/images/icons/imageIcon.svg";
import { ChatInterface, MessageInterface } from "@/interfaces/ChatInterface";
import SendIcon from "@/images/icons/sendIcon.svg";
import { useAppDispatch } from "@/redux/hook";
import {addToMessages, sendChat} from "@/features/connect/connect.slice";
import { useSelector } from "react-redux";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { useMediaQuery } from "react-responsive";
import { usePusher } from "@/hooks/usePusher";
import {formatSingleTime} from "@/lib/helper";

type OpenChatProps = {
  toggleModal: () => void;
  messages: MessageInterface[];
  chat: ChatInterface;
  user_id: number;
  toggleOpenedChat?: () => void;
};

const OpenedChat: React.FC<OpenChatProps> = ({
  toggleModal,
  chat,
  messages,
  user_id,
  toggleOpenedChat,
}) => {
  const dispatch = useAppDispatch();
  const [text, setText] = useState<string>("");
  const { authToken: token, user: authUser } = useSelector((state: any) => state.auth);
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  const userType = chat?.sender?.id !== user_id ? chat?.sender : chat?.receiver
  const receiver_id = authUser.id === chat?.sender?.id ? chat?.receiver?.id : chat?.sender.id

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Scroll to bottom when messages are updated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [text]);

  const sendMessage = () => {
    if (!text.trim()) return; // Don't send empty messages

    const receiver_id =
      user_id === chat.sender.id ? chat.receiver.id : chat.sender.id;
    setText("");
    dispatch(sendChat({ receiver_id, token, message: text.trim() })).then((res: any) => {
      dispatch(addToMessages({ message: res.payload.data.new_message, user: authUser }))
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift+Enter: Allow new line (default behavior)
        return;
      } else {
        // Enter: Send message
        e.preventDefault();
        sendMessage();
      }
    }
  };

  // const {data} = usePusher(`private-user-${user_id}`, "message-sent");

  // console.log({data})

  return (
      <div className="w-screen laptop:w-[560px] h-[648px] border-none laptop:border-t-[1px] laptop:border-b-[1px] laptop:border-r-[1px] bg-white flex flex-col laptop:rounded-tr-[16px] laptop:rounded-br-[16px]">

        {/* Header */}
        <div className="h-[48px] w-full bg-grey-20 text-white px-[8px] py-[12px] laptop:rounded-tr-[16px] flex items-center justify-between">
          <div className="flex gap-2 items-center px-[16px]">
            <ChevronLeft className="flex laptop:hidden cursor-pointer" onClick={toggleOpenedChat} />
            <Image src={userType?.avatar} alt="avatar" width={24} height={24} className="w-[24px] h-[24px] rounded-[8px] border-[1px] border-grey-90" />
            <p className="font-semibold text-[14px] text-black-light">{userType?.username}</p>
            <DotIcon className="w-[4px]" />
            <p className="text-text-grey text-[14px] font-semibold">L{userType?.lemon_id}</p>
          </div>
          <MoreIcon className="cursor-pointer" onClick={toggleModal} />
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col-reverse overflow-y-auto bg-white p-[16px]">
          <div className="flex flex-col w-full gap-[12px] overflow-y-auto hide-scrollbar">
            {messages.map((message: MessageInterface, index: number) => (
                <div
                    className={`text-right p-[8px] max-w-[303px] ml-auto rounded-[12px] ${
                        message?.sender ? "bg-light-green-10" : "bg-grey-20"
                    }`}
                    key={index}
                >
                  <p className="font-normal text-[14px] whitespace-pre-wrap">{message?.message}</p>
                  <p className="text-[12px] text-right text-text-grey">{formatSingleTime(message?.created_at)}</p>
                </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Mobile Input */}
        {isMobile && (
            <div className="w-full bg-light_grey text-white p-[16px] px-[13px]">
              <div className="flex gap-[8px] items-center">
                <div className="flex items-end justify-between gap-3 bg-light_grey p-2 px-[12px] rounded-full w-full border-[1px]">
                  <div className="w-full">
                    <textarea
                        ref={textareaRef}
                        className="rounded-xl w-full text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent text-black-light resize-none overflow-hidden min-h-[20px] max-h-[120px]"
                        placeholder="Reply..."
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        value={text}
                        rows={1}
                    />
                  </div>
                  {text.trim() && (
                      <div className="flex-shrink-0">
                        <SendIcon className="w-[19.72px] h-[19.25px] cursor-pointer" onClick={sendMessage} />
                      </div>
                  )}
                </div>
                <ImageIcon className="w-[19.5px] cursor-pointer flex-shrink-0" />
              </div>
            </div>
        )}

        {/* Desktop Input */}
        <div className="hidden laptop:flex w-full bg-light_grey text-white p-[16px] px-[13px]">
          <div className="flex gap-[8px] items-end w-full">
            <div className="flex items-end justify-between gap-3 bg-light_grey p-2 px-[12px] rounded-full w-full border-[1px]">
              <div className="w-full">
          <textarea
              ref={textareaRef}
              className="rounded-xl w-full text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent text-black-light resize-none overflow-hidden min-h-[20px] max-h-[120px]"
              placeholder="Reply..."
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              value={text}
              rows={1}
          />
              </div>
              {text.trim() && (
                  <div className="flex-shrink-0">
                    <SendIcon className="w-[19.72px] h-[19.25px] cursor-pointer" onClick={sendMessage} />
                  </div>
              )}
            </div>
            <ImageIcon className="w-[19.5px] cursor-pointer flex-shrink-0" />
          </div>
        </div>

      </div>

  );
};

export default OpenedChat;
