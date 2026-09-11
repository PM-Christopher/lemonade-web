"use client";
import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import MoreIcon from "@/images/icons/moreIcon.svg";
import ImageIcon from "@/images/icons/imageIcon.svg";
import {ChatInterface, MessageInterface} from "@/interfaces/ChatInterface";
import SendIcon from "@/images/icons/sendIcon.svg";
import {useAppDispatch} from "@/redux/hook";
import {addToMessages, sendChat} from "@/features/connect/connect.slice";
import {useSelector} from "react-redux";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import {useMediaQuery} from "react-responsive";
import {usePusher} from "@/hooks/usePusher";
import {formatSingleTime, getInitials} from "@/lib/helper";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {connectApi} from "@/features/connect/api";
import {Spinner} from "evergreen-ui";
import {WindmillSpinner} from "react-spinner-overlay";

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
    const [text, setText] = useState<string>("");
    const [mediaFiles, setMediaFiles] = useState<string[]>([])
    const {authToken: token, user: authUser} = useSelector((state: any) => state.auth);
    const isMobile = useMediaQuery({query: "(max-width: 1023px)"});
    const userType = chat?.sender?.id !== user_id ? chat?.sender : chat?.receiver
    const receiver_id = authUser.id === chat?.sender?.id ? chat?.receiver?.id : chat?.sender.id
    const [mediaLoading, setMediaLoading] = useState<boolean>(false)

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Scroll to bottom when messages are updated
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: "smooth"});
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
        if (!text.trim() && mediaFiles.length < 1) return; // Don't send empty messages

        // const receiver_id = user_id === chat?.sender.id ? chat.receiver.id : chat?.sender.id;
        const receiver_id: number | null = chat
            ? (user_id === chat.sender.id ? chat.receiver.id : chat.sender.id)
            : null;
        setText("");
        dispatch(sendChat({receiver_id, token, message: text.trim(), media: mediaFiles})).then((res: any) => {
            setMediaFiles([])
            dispatch(addToMessages({message: res.payload.data.new_message, user: authUser}))
        });
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
    }

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
                    })
                );
            }

            if (formData.has("files[]")) {
                try {
                    const {data} = await connectApi.uploadMultiple(formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    if (data.status) {
                        setMediaLoading(false);
                        setMediaFiles((prev) => [...prev, ...data.data.images]);
                        dispatch(
                            updateToastifyReducer({
                                show: true,
                                message: "Images uploaded",
                                type: "success",
                            })
                        );
                    } else {
                        setMediaLoading(false);
                        dispatch(
                            updateToastifyReducer({
                                show: true,
                                message: "Error uploading image",
                                type: "error",
                            })
                        );
                    }
                } catch (err: any) {
                    setMediaLoading(false);
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: err?.response?.data?.message || "Error",
                            type: "error",
                        })
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
        setMediaFiles(prevImages => prevImages.filter(image => image !== imageToRemove));
    };

    return (
        <div
            className="w-screen laptop:w-[560px] h-[648px] border-none laptop:border-t-[1px] laptop:border-b-[1px] laptop:border-r-[1px] bg-white flex flex-col laptop:rounded-tr-[16px] laptop:rounded-br-[16px]">

            {/* Header */}
            <div
                className="h-[48px] w-full bg-grey-20 text-white px-[8px] py-[12px] laptop:rounded-tr-[16px] flex items-center justify-between">
                <div className="flex gap-2 items-center px-[16px]">
                    <ChevronLeft className="flex laptop:hidden cursor-pointer" onClick={toggleOpenedChat}/>
                    {
                        userType?.avatar ? (
                            <Image
                                src={userType?.avatar}
                                alt="avatar"
                                width={24}
                                height={24}
                                className="w-[24px] h-[24px] rounded-[8px] border-[1px] border-grey-90"
                            />
                        ) : (
                            <div
                                className="flex items-center justify-center rounded-full border-[2px] border-[#3B4152] w-[40px] h-[40px]
                   text-sm font-medium text-white bg-gradient-green
                   transition-all duration-300 ease-in-out
                   group-hover:scale-110 group-hover:border-green-400
                   group-hover:shadow-[0_0_10px_rgba(34,197,94,0.4)] group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-600"
                            >
                                <p className="text-[18px] font-ruso">{getInitials(userType?.username)}</p>
                            </div>
                        )
                    }
                    <p className="font-semibold text-[14px] text-black-light">{userType?.username}</p>
                    <DotIcon className="w-[4px]"/>
                    <p className="text-text-grey text-[14px] font-semibold">L{userType?.lemon_id}</p>
                </div>
                <MoreIcon className="cursor-pointer" onClick={toggleModal}/>
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
                            {
                                message?.media && message?.media.length > 0 && (
                                    <>
                                        <Image src={message?.media[0]} alt={'media-file'} className={'w-36 h-36'}
                                               width={144} height={144}/>
                                    </>
                                )
                            }
                            <p className="text-[12px] text-right text-text-grey">{formatSingleTime(message?.created_at)}</p>
                        </div>
                    ))}
                    <div ref={messagesEndRef}/>
                </div>
            </div>

            {/* Mobile Input */}
            {isMobile && (
                <div className="w-full bg-light_grey text-white p-[16px] px-[13px]">
                    <div className="flex gap-[8px] w-full items-center">
                        <div
                            className="flex flex-col justify-between gap-3 bg-light_grey p-2 px-[12px] rounded-[20px] w-full border-[1px]">
                            <div className={'flex items-center'}>
                                <div className="w-full">
                <textarea
                    ref={textareaRef}
                    className="rounded-xl px-[10px] mt-1 w-full text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent text-black-light resize-none overflow-hidden min-h-[20px] max-h-[120px]"
                    placeholder="Reply..."
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={text}
                    rows={1}
                />
                                </div>
                                {text.trim() && (
                                    <div className="flex-shrink-0">
                                        {
                                            mediaLoading ? (
                                                <Spinner size={20} color={'#BFDF37'}/>
                                            ) : (
                                                <SendIcon className="w-[19.72px] h-[19.25px] cursor-pointer"
                                                          onClick={sendMessage}/>
                                            )
                                        }

                                    </div>
                                )}
                            </div>
                            {
                                mediaFiles?.length > 0 && (
                                    <div className={'flex gap-4 flex-wrap'}>
                                        {
                                            mediaFiles?.slice(0, 2)?.map((mediaFile, index) => (
                                                <div key={index}
                                                     className="relative w-36 h-36 rounded-[20px] overflow-hidden group">
                                                    <Image
                                                        alt="media_file"
                                                        src={mediaFile}
                                                        width={144}
                                                        height={144}
                                                        className="w-full h-full object-cover transition-all duration-200 group-hover:blur-sm"
                                                    />
                                                    <div
                                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                        <button
                                                            className="bg-red-600 text-white text-sm px-2 py-1 rounded-md font-sans"
                                                            onClick={() => removeImage(mediaFile)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        {mediaFiles.length > 2 && (
                                            <div className="relative w-36 h-36 rounded-[20px] overflow-hidden group">
                                                <Image
                                                    alt="media_file"
                                                    src={mediaFiles[2]}
                                                    width={144}
                                                    height={144}
                                                    className="w-full h-full object-cover filter blur-sm brightness-75"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-[20px] font-semibold">
                                  +{mediaFiles.length - 2}
                                </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        </div>
                        <ImageIcon className="w-[19.5px] cursor-pointer flex-shrink-0" onClick={handleMediaInput}/>
                    </div>
                </div>
            )}

            {/* Desktop Input */}
            <div className="hidden laptop:flex w-full bg-light_grey text-white p-[16px] px-[13px]">
                <div className="flex gap-[8px] w-full items-center">
                    <div
                        className="flex flex-col justify-between gap-3 bg-light_grey p-2 px-[12px] rounded-[20px] w-full border-[1px]">
                        <div className={'flex items-center'}>
                            <div className="w-full">
                <textarea
                    ref={textareaRef}
                    className="rounded-xl px-[10px] mt-1 w-full text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent text-black-light resize-none overflow-hidden min-h-[20px] max-h-[120px]"
                    placeholder="Reply..."
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={text}
                    rows={1}
                />
                            </div>
                            {text.trim() || mediaFiles.length > 0 && (
                                <div className="flex-shrink-0">
                                    {
                                        mediaLoading ? (
                                            <Spinner size={20} color={'#BFDF37'}/>
                                        ) : (
                                            <SendIcon className="w-[19.72px] h-[19.25px] cursor-pointer"
                                                      onClick={sendMessage}/>
                                        )
                                    }

                                </div>
                            )}
                        </div>
                        {
                            mediaFiles?.length > 0 && (
                                <div className={'flex gap-4 flex-wrap'}>
                                    {
                                        mediaFiles?.slice(0, 2)?.map((mediaFile, index) => (
                                            <div key={index}
                                                 className="relative w-36 h-36 rounded-[20px] overflow-hidden group">
                                                <Image
                                                    alt="media_file"
                                                    src={mediaFile}
                                                    width={144}
                                                    height={144}
                                                    className="w-full h-full object-cover transition-all duration-200 group-hover:blur-sm"
                                                />
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                    <button
                                                        className="bg-red-600 text-white text-sm px-2 py-1 rounded-md font-sans"
                                                        onClick={() => removeImage(mediaFile)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    {mediaFiles.length > 2 && (
                                        <div className="relative w-36 h-36 rounded-[20px] overflow-hidden group">
                                            <Image
                                                alt="media_file"
                                                src={mediaFiles[2]}
                                                width={144}
                                                height={144}
                                                className="w-full h-full object-cover filter blur-sm brightness-75"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-[20px] font-semibold">
                                  +{mediaFiles.length - 2}
                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        }
                    </div>
                    <ImageIcon className="w-[19.5px] cursor-pointer flex-shrink-0" onClick={handleMediaInput}/>
                </div>
            </div>
            <input
                type="file"
                multiple={true}
                ref={fileInputRef}
                style={{display: 'none'}}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default OpenedChat;
