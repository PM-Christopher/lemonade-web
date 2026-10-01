"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import MoreIcon from "@/images/icons/moreIcon.svg";
import ImageIcon from "@/images/icons/imageIcon.svg";
import { ChatInterface, MessageInterface } from "@/interfaces/ChatInterface";
import SendIcon from "@/images/icons/sendIcon.svg";
import { useAppDispatch } from "@/redux/hook";
import { useQueryClient } from "@tanstack/react-query";
import { useSendChatMutation } from "@/features/connect/mutations";
import { appendIncomingChatMessage } from "@/features/connect/queries";
import { useSelector } from "react-redux";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { useMediaQuery } from "react-responsive";
import { usePusher } from "@/hooks/usePusher";
import { formatSingleTime, getInitials } from "@/lib/helper";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { connectApi } from "@/features/connect/api";
import { Loader2 } from "lucide-react";

type OpenChatProps = {
  toggleModal: () => void;
  messages: MessageInterface[];
  chat: ChatInterface | null;
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
  const queryClient = useQueryClient();
  const sendChatMutation = useSendChatMutation();
  const [text, setText] = useState<string>("");
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const { user: authUser } = useSelector((state: any) => state.auth);
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  const userType = chat?.sender?.id !== user_id ? chat?.sender : chat?.receiver;
  const receiver_id = authUser.id === chat?.sender?.id ? chat?.receiver?.id : chat?.sender.id;
  const [mediaLoading, setMediaLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const sendMessage = () => {
    if (!text.trim() && mediaFiles.length < 1) return; // Don't send empty messages

    const receiver_id: number | null = chat
      ? user_id === chat.sender.id
        ? chat.receiver.id
        : chat.sender.id
      : null;
    setText("");
    sendChatMutation.mutate(
      { receiverId: receiver_id, message: text.trim(), media: mediaFiles },
      {
        onSuccess: (res) => {
          setMediaFiles([]);
          // Same shape/target as a Pusher-pushed message (both are the
          // raw OutgoingChatMessage), so this reuses the same append
          // logic rather than duplicating the viewer-relative mapping.
          appendIncomingChatMessage(queryClient, authUser.id, res.new_message);
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !mediaLoading) {
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

  const handleMediaInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setMediaLoading(true);
    if (files) {
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

      const formData = new FormData();
      const oversizedFiles: string[] = [];

      Array.from(files).forEach((file) => {
        if (file.size > maxSizeInBytes) {
          oversizedFiles.push(file.name);
        } else {
          formData.append("files[]", file);
        }
      });

      if (oversizedFiles.length > 0) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: `The following files exceed 2MB: ${oversizedFiles.join(", ")}`,
            type: "error",
          }),
        );
      }

      if (formData.has("files[]")) {
        try {
          const { data } = await connectApi.uploadMultiple(formData);

          // Found live: the envelope key is `success`, not `status`
          // — this was always false, so a successful upload always
          // showed the "error" toast below.
          if (data.success) {
            setMediaLoading(false);
            setMediaFiles((prev) => [...prev, ...data.data.images]);
            dispatch(
              updateToastifyReducer({
                show: true,
                message: "Images uploaded",
                type: "success",
              }),
            );
          } else {
            setMediaLoading(false);
            dispatch(
              updateToastifyReducer({
                show: true,
                message: "Error uploading image",
                type: "error",
              }),
            );
          }
        } catch (err: any) {
          setMediaLoading(false);
          dispatch(
            updateToastifyReducer({
              show: true,
              message: err?.response?.data?.message || "Error",
              type: "error",
            }),
          );
        }
      }
    }
    // Reset file input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (imageToRemove: string) => {
    setMediaFiles((prevImages) => prevImages.filter((image) => image !== imageToRemove));
  };

  return (
    <div className="laptop:w-[560px] laptop:rounded-br-[16px] laptop:rounded-tr-[16px] laptop:border-b-[1px] laptop:border-r-[1px] laptop:border-t-[1px] flex h-[648px] w-screen flex-col border-none bg-white">
      {/* Header */}
      <div className="bg-grey-20 laptop:rounded-tr-[16px] flex h-[48px] w-full items-center justify-between px-[8px] py-[12px] text-white">
        <div className="flex items-center gap-2 px-[16px]">
          <ChevronLeft className="laptop:hidden flex cursor-pointer" onClick={toggleOpenedChat} />
          {userType?.avatar ? (
            <Image
              src={userType?.avatar}
              alt="avatar"
              width={24}
              height={24}
              className="border-grey-90 h-[24px] w-[24px] rounded-[8px] border-[1px]"
            />
          ) : (
            <div className="bg-gradient-green flex h-[40px] w-[40px] items-center justify-center rounded-full border-[2px] border-[#3B4152] text-sm font-medium text-white transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-600 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]">
              <p className="font-ruso text-[18px]">{getInitials(userType?.username)}</p>
            </div>
          )}
          <p className="text-black-light text-[14px] font-semibold">{userType?.username}</p>
          <DotIcon className="w-[4px]" />
          <p className="text-text-grey text-[14px] font-semibold">L{userType?.lemon_id}</p>
        </div>
        <MoreIcon className="cursor-pointer" onClick={toggleModal} />
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col-reverse overflow-y-auto bg-white p-[16px]">
        <div className="hide-scrollbar flex w-full flex-col gap-[12px] overflow-y-auto">
          {messages.map((message: MessageInterface, index: number) => (
            <div
              className={`ml-auto max-w-[303px] rounded-[12px] p-[8px] text-right ${
                message?.sender ? "bg-light-green-10" : "bg-grey-20"
              }`}
              key={index}
            >
              <p className="text-[14px] font-normal whitespace-pre-wrap">{message?.message}</p>
              {message?.media && message?.media.length > 0 && (
                <>
                  <Image
                    src={message?.media[0]}
                    alt={"media-file"}
                    className={"h-36 w-36"}
                    width={144}
                    height={144}
                  />
                </>
              )}
              <p className="text-text-grey text-right text-[12px]">
                {formatSingleTime(message?.created_at)}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Mobile Input */}
      {isMobile && (
        <div className="bg-light_grey w-full p-[16px] px-[13px] text-white">
          <div className="flex w-full items-center gap-[8px]">
            <div className="bg-light_grey flex w-full flex-col justify-between gap-3 rounded-[20px] border-[1px] p-2 px-[12px]">
              <div className={"flex items-center"}>
                <div className="w-full">
                  <textarea
                    ref={textareaRef}
                    className="bg-light_grey text-black-light mt-1 max-h-[120px] min-h-[20px] w-full resize-none overflow-hidden rounded-xl border-0 px-[10px] text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                    placeholder="Reply..."
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={text}
                    rows={1}
                  />
                </div>
                {text.trim() && (
                  <div className="flex-shrink-0">
                    {mediaLoading ? (
                      <Loader2 className="text-light-green-90 h-5 w-5 animate-spin" />
                    ) : (
                      <SendIcon
                        className="h-[19.25px] w-[19.72px] cursor-pointer"
                        onClick={sendMessage}
                      />
                    )}
                  </div>
                )}
              </div>
              {mediaFiles?.length > 0 && (
                <div className={"flex flex-wrap gap-4"}>
                  {mediaFiles?.slice(0, 2)?.map((mediaFile, index) => (
                    <div
                      key={index}
                      className="group relative h-36 w-36 overflow-hidden rounded-[20px]"
                    >
                      <Image
                        alt="media_file"
                        src={mediaFile}
                        width={144}
                        height={144}
                        className="h-full w-full object-cover transition-all duration-200 group-hover:blur-sm"
                      />
                      <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          className="rounded-md bg-red-600 px-2 py-1 font-sans text-sm text-white"
                          onClick={() => removeImage(mediaFile)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {mediaFiles.length > 2 && (
                    <div className="group relative h-36 w-36 overflow-hidden rounded-[20px]">
                      <Image
                        alt="media_file"
                        src={mediaFiles[2]}
                        width={144}
                        height={144}
                        className="h-full w-full object-cover blur-sm brightness-75 filter"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[20px] font-semibold text-white">
                          +{mediaFiles.length - 2}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <ImageIcon
              className="w-[19.5px] flex-shrink-0 cursor-pointer"
              onClick={handleMediaInput}
            />
          </div>
        </div>
      )}

      {/* Desktop Input */}
      <div className="bg-light_grey laptop:flex hidden w-full p-[16px] px-[13px] text-white">
        <div className="flex w-full items-center gap-[8px]">
          <div className="bg-light_grey flex w-full flex-col justify-between gap-3 rounded-[20px] border-[1px] p-2 px-[12px]">
            <div className={"flex items-center"}>
              <div className="w-full">
                <textarea
                  ref={textareaRef}
                  className="bg-light_grey text-black-light mt-1 max-h-[120px] min-h-[20px] w-full resize-none overflow-hidden rounded-xl border-0 px-[10px] text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                  placeholder="Reply..."
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  value={text}
                  rows={1}
                />
              </div>
              {text.trim() ||
                (mediaFiles.length > 0 && (
                  <div className="flex-shrink-0">
                    {mediaLoading ? (
                      <Loader2 className="text-light-green-90 h-5 w-5 animate-spin" />
                    ) : (
                      <SendIcon
                        className="h-[19.25px] w-[19.72px] cursor-pointer"
                        onClick={sendMessage}
                      />
                    )}
                  </div>
                ))}
            </div>
            {mediaFiles?.length > 0 && (
              <div className={"flex flex-wrap gap-4"}>
                {mediaFiles?.slice(0, 2)?.map((mediaFile, index) => (
                  <div
                    key={index}
                    className="group relative h-36 w-36 overflow-hidden rounded-[20px]"
                  >
                    <Image
                      alt="media_file"
                      src={mediaFile}
                      width={144}
                      height={144}
                      className="h-full w-full object-cover transition-all duration-200 group-hover:blur-sm"
                    />
                    <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        className="rounded-md bg-red-600 px-2 py-1 font-sans text-sm text-white"
                        onClick={() => removeImage(mediaFile)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                {mediaFiles.length > 2 && (
                  <div className="group relative h-36 w-36 overflow-hidden rounded-[20px]">
                    <Image
                      alt="media_file"
                      src={mediaFiles[2]}
                      width={144}
                      height={144}
                      className="h-full w-full object-cover blur-sm brightness-75 filter"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[20px] font-semibold text-white">
                        +{mediaFiles.length - 2}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <ImageIcon
            className="w-[19.5px] flex-shrink-0 cursor-pointer"
            onClick={handleMediaInput}
          />
        </div>
      </div>
      <input
        type="file"
        multiple={true}
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default OpenedChat;
