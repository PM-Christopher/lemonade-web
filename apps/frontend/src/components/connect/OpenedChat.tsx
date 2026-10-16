"use client";
import React, { useEffect, useRef, useState } from "react";
import { images } from "@/lib/images";
import { FallbackImage } from "@/components/global/FallbackImage";
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
import { formatSingleTime, getInitials } from "@/lib/helper";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { connectApi } from "@/features/connect/api";
import { Loader2 } from "lucide-react";
import type { RootState } from "@/redux/store";
import { errorMessage } from "@/lib/api-error";

// Tallest the message box grows before it scrolls.
const MAX_INPUT_HEIGHT = 160;

type OpenChatProps = {
  toggleModal: () => void;
  messages: MessageInterface[];
  chat: ChatInterface | null;
  user_id: string | undefined;
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
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  const userType = chat?.sender?.id !== user_id ? chat?.sender : chat?.receiver;
  const [mediaLoading, setMediaLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const mobileTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const desktopTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Scroll to bottom when messages are updated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Grow the input with its content, up to a cap, then scroll inside it.
  useEffect(() => {
    [mobileTextareaRef.current, desktopTextareaRef.current].forEach((el) => {
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, MAX_INPUT_HEIGHT)}px`;
      el.style.overflowY = el.scrollHeight > MAX_INPUT_HEIGHT ? "auto" : "hidden";
    });
  }, [text, isMobile]);

  const sendMessage = () => {
    if (!text.trim() && mediaFiles.length < 1) return; // Don't send empty messages
    if (!chat) return; // The receiver is unknown until the chat has loaded

    const receiver_id = user_id === chat.sender.id ? chat.receiver.id : chat.sender.id;
    setText("");
    sendChatMutation.mutate(
      { receiverId: receiver_id, message: text.trim(), media: mediaFiles },
      {
        onSuccess: (res) => {
          setMediaFiles([]);
          // Same shape/target as a Pusher-pushed message (both are the
          // raw OutgoingChatMessage), so this reuses the same append
          // logic rather than duplicating the viewer-relative mapping.
          if (authUser) appendIncomingChatMessage(queryClient, authUser.id, res.new_message);
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
          const result = await connectApi.uploadMultiple(formData);
          setMediaLoading(false);
          setMediaFiles((prev) => [...prev, ...result.images]);
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Images uploaded",
              type: "success",
            }),
          );
        } catch (err) {
          setMediaLoading(false);
          dispatch(
            updateToastifyReducer({
              show: true,
              message: errorMessage(err, "Error"),
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
    <div className="laptop:w-140 laptop:rounded-br-2xl laptop:rounded-tr-2xl laptop:border-b laptop:border-r laptop:border-t flex h-162 w-screen flex-col border-none bg-white">
      {/* Header */}
      <div className="bg-grey-20 laptop:rounded-tr-2xl flex h-12 w-full items-center justify-between px-2 py-3 text-white">
        <div className="flex items-center gap-2 px-4">
          <ChevronLeft className="laptop:hidden flex cursor-pointer" onClick={toggleOpenedChat} />
          {userType?.avatar ? (
            <FallbackImage
              src={userType?.avatar}
              fallbackSrc={images.AVATAR_4}
              alt="avatar"
              width={24}
              height={24}
              className="border-grey-90 h-6 w-6 rounded-lg border"
            />
          ) : (
            <div className="bg-gradient-green flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#3B4152] text-sm font-medium text-white transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-green-400 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-600 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)]">
              <p className="font-ruso text-body-xl">{getInitials(userType?.username)}</p>
            </div>
          )}
          <p className="text-black-light text-body-s font-semibold">{userType?.username}</p>
          <DotIcon className="w-1" />
          <p className="text-text-grey text-body-s font-semibold">L{userType?.lemon_id}</p>
        </div>
        <MoreIcon className="cursor-pointer" onClick={toggleModal} />
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col-reverse overflow-y-auto bg-white p-4">
        <div className="hide-scrollbar flex w-full flex-col gap-3 overflow-y-auto">
          {messages.map((message: MessageInterface, index: number) => (
            <div
              className={`max-w-75.75 rounded-xl p-2 ${
                message?.sender
                  ? "bg-light-green-10 ml-auto text-right"
                  : "bg-grey-20 mr-auto text-left"
              }`}
              key={index}
            >
              <p className="text-body-s font-normal whitespace-pre-wrap">{message?.message}</p>
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
              <p className="text-text-grey text-meta leading-normal">
                {formatSingleTime(message?.created_at)}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Mobile Input */}
      {isMobile && (
        <div className="bg-light_grey w-full p-4 px-3.25 text-white">
          <div className="flex w-full items-center gap-2">
            <div className="bg-light_grey flex w-full flex-col justify-between gap-3 rounded-2xl border p-2 px-3">
              <div className={"flex items-center"}>
                <div className="w-full">
                  <textarea
                    ref={mobileTextareaRef}
                    className="bg-light_grey text-black-light text-body-s mt-1 min-h-5 w-full resize-none overflow-hidden rounded-xl border-0 px-2.5 focus:border-transparent focus:ring-0 focus:outline-none"
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
                      <SendIcon className="h-4.75 w-5 cursor-pointer" onClick={sendMessage} />
                    )}
                  </div>
                )}
              </div>
              {mediaFiles?.length > 0 && (
                <div className={"flex flex-wrap gap-4"}>
                  {mediaFiles?.slice(0, 2)?.map((mediaFile, index) => (
                    <div
                      key={index}
                      className="group relative h-36 w-36 overflow-hidden rounded-2xl"
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
                    <div className="group relative h-36 w-36 overflow-hidden rounded-2xl">
                      <Image
                        alt="media_file"
                        src={mediaFiles[2]}
                        width={144}
                        height={144}
                        className="h-full w-full object-cover blur-sm brightness-75 filter"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-title-r leading-normal font-semibold text-white">
                          +{mediaFiles.length - 2}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <ImageIcon className="w-5 flex-shrink-0 cursor-pointer" onClick={handleMediaInput} />
          </div>
        </div>
      )}

      {/* Desktop Input */}
      <div className="bg-light_grey laptop:flex hidden w-full p-4 px-3.25 text-white">
        <div className="flex w-full items-center gap-2">
          <div className="bg-light_grey flex w-full flex-col justify-between gap-3 rounded-2xl border p-2 px-3">
            <div className={"flex items-center"}>
              <div className="w-full">
                <textarea
                  ref={desktopTextareaRef}
                  className="bg-light_grey text-black-light text-body-s mt-1 min-h-5 w-full resize-none overflow-hidden rounded-xl border-0 px-2.5 focus:border-transparent focus:ring-0 focus:outline-none"
                  placeholder="Reply..."
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  value={text}
                  rows={1}
                />
              </div>
              {(text.trim() || mediaFiles.length > 0) && (
                <div className="flex-shrink-0">
                  {mediaLoading ? (
                    <Loader2 className="text-light-green-90 h-5 w-5 animate-spin" />
                  ) : (
                    <SendIcon className="h-4.75 w-5 cursor-pointer" onClick={sendMessage} />
                  )}
                </div>
              )}
            </div>
            {mediaFiles?.length > 0 && (
              <div className={"flex flex-wrap gap-4"}>
                {mediaFiles?.slice(0, 2)?.map((mediaFile, index) => (
                  <div key={index} className="group relative h-36 w-36 overflow-hidden rounded-2xl">
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
                  <div className="group relative h-36 w-36 overflow-hidden rounded-2xl">
                    <Image
                      alt="media_file"
                      src={mediaFiles[2]}
                      width={144}
                      height={144}
                      className="h-full w-full object-cover blur-sm brightness-75 filter"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-title-r leading-normal font-semibold text-white">
                        +{mediaFiles.length - 2}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <ImageIcon className="w-5 flex-shrink-0 cursor-pointer" onClick={handleMediaInput} />
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
